const OpenAI = require('openai');
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @desc    Chat with AI tutor
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithTutor = async (req, res, next) => {
  try {
    const { message, courseId, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let systemMessage = 'You are an AI tutor for an e-learning platform. Help students with their learning questions, provide explanations, and guide them through concepts. Be encouraging and supportive.';

    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) {
        systemMessage += ` The student is currently studying: ${course.title} - ${course.description}`;
      }
    }

    if (context) {
      systemMessage += ` Additional context: ${context}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      response
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get personalized course recommendations
// @route   GET /api/ai/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.course', 'category tags');

    const progressRecords = await Progress.find({ user: req.user.id });

    // Get user's interests based on enrolled courses
    const enrolledCategories = user.enrolledCourses.map(e => e.course.category);
    const enrolledTags = user.enrolledCourses.flatMap(e => e.course.tags || []);

    // Find recommended courses
    const recommendations = await Course.find({
      isPublished: true,
      _id: { $nin: user.enrolledCourses.map(e => e.course._id) },
      $or: [
        { category: { $in: enrolledCategories } },
        { tags: { $in: enrolledTags } }
      ]
    })
      .populate('instructor', 'name profile.avatar')
      .sort('-rating.average')
      .limit(5);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI feedback on assignment/answer
// @route   POST /api/ai/feedback
// @access  Private
exports.analyzeFeedback = async (req, res, next) => {
  try {
    const { answer, question, correctAnswer } = req.body;

    if (!answer || !question) {
      return res.status(400).json({
        success: false,
        message: 'Answer and question are required'
      });
    }

    let prompt = `Question: ${question}\n\nStudent's Answer: ${answer}`;

    if (correctAnswer) {
      prompt += `\n\nCorrect Answer: ${correctAnswer}`;
    }

    prompt += '\n\nProvide constructive feedback on the student\'s answer. Highlight what they did well and areas for improvement.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an educational AI providing constructive feedback on student answers. Be supportive and specific.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const feedback = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
