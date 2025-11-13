const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Progress = require('../models/Progress');

// @desc    Get all quizzes for a course
// @route   GET /api/quizzes?courseId=xxx
// @access  Private
exports.getQuizzes = async (req, res, next) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const quizzes = await Quiz.find({ course: courseId, isPublished: true })
      .select('-questions.correctAnswer -questions.explanation')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!quiz.isAvailable()) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is not available at this time'
      });
    }

    // Get student version (without answers)
    const studentQuiz = quiz.getForStudent();

    // Get attempt history
    const attempts = await QuizAttempt.find({
      quiz: quiz._id,
      user: req.user.id
    }).sort('-completedAt');

    // Check if user can attempt
    const canAttempt = attempts.length < quiz.attemptsAllowed;

    res.status(200).json({
      success: true,
      quiz: studentQuiz,
      attempts: attempts.length,
      attemptsAllowed: quiz.attemptsAllowed,
      canAttempt,
      bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Teacher
exports.createQuiz = async (req, res, next) => {
  try {
    req.body.instructor = req.user.id;

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher
exports.updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz'
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz'
      });
    }

    await quiz.remove();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!quiz.isAvailable()) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is not available at this time'
      });
    }

    // Check attempts
    const attemptNumber = await QuizAttempt.getNextAttemptNumber(req.user.id, quiz._id);

    if (attemptNumber > quiz.attemptsAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Maximum attempts reached'
      });
    }

    const { answers, timeSpent, startedAt } = req.body;

    if (!answers) {
      return res.status(400).json({
        success: false,
        message: 'Answers are required'
      });
    }

    // Grade the quiz
    const result = quiz.gradeSubmission(answers);

    // Save attempt
    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      user: req.user.id,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
        isCorrect: result.results.find(r => r.questionId.toString() === questionId)?.isCorrect || false,
        pointsEarned: result.results.find(r => r.questionId.toString() === questionId)?.pointsEarned || 0
      })),
      score: result.score,
      earnedPoints: result.earnedPoints,
      totalPoints: result.totalPoints,
      passed: result.passed,
      attemptNumber,
      timeSpent: timeSpent || 0,
      startedAt: startedAt || new Date()
    });

    // Update progress
    const progress = await Progress.findOne({
      user: req.user.id,
      course: quiz.course
    });

    if (progress) {
      await progress.recordQuizScore(quiz._id, result.score, result.passed);
    }

    res.status(200).json({
      success: true,
      message: result.passed ? 'Quiz passed!' : 'Quiz completed',
      result,
      attempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz attempts
// @route   GET /api/quizzes/:id/attempts
// @access  Private
exports.getQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.id,
      user: req.user.id
    }).sort('-completedAt');

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz statistics
// @route   GET /api/quizzes/:id/statistics
// @access  Private/Teacher
exports.getQuizStatistics = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view quiz statistics'
      });
    }

    const attempts = await QuizAttempt.find({ quiz: quiz._id });
    const uniqueStudents = [...new Set(attempts.map(a => a.user.toString()))];

    const averageScore = await QuizAttempt.getAverageScore(quiz._id);
    const passRate = await QuizAttempt.getPassRate(quiz._id);

    const statistics = {
      totalAttempts: attempts.length,
      uniqueStudents: uniqueStudents.length,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      questionStats: quiz.questions.map(q => {
        const questionAttempts = attempts.flatMap(a =>
          a.answers.filter(ans => ans.questionId.toString() === q._id.toString())
        );

        const correctCount = questionAttempts.filter(a => a.isCorrect).length;

        return {
          questionId: q._id,
          question: q.question,
          attempts: questionAttempts.length,
          correctPercentage: questionAttempts.length > 0
            ? Math.round((correctCount / questionAttempts.length) * 100)
            : 0
        };
      })
    };

    res.status(200).json({
      success: true,
      statistics
    });
  } catch (error) {
    next(error);
  }
};
