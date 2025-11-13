const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const {
      category,
      level,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    const query = { isPublished: true };

    // Filters
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name profile.avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profile.avatar profile.bio')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name profile.avatar'
        }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Teacher
exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    // Add to user's created courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.remove();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Cannot enroll in unpublished course'
      });
    }

    // Enroll student
    await course.enrollStudent(req.user.id);

    // Update user enrollment
    const user = await User.findById(req.user.id);
    await user.enrollInCourse(course._id);

    // Create progress tracker
    await Progress.create({
      user: req.user.id,
      course: course._id
    });

    res.status(200).json({
      success: true,
      message: 'Enrolled in course successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from course
// @route   DELETE /api/courses/:id/enroll
// @access  Private/Student
exports.unenrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.unenrollStudent(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Unenrolled from course successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish course
// @route   POST /api/courses/:id/publish
// @access  Private/Teacher
exports.publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this course'
      });
    }

    await course.publish();

    res.status(200).json({
      success: true,
      message: 'Course published successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unpublish course
// @route   POST /api/courses/:id/unpublish
// @access  Private/Teacher
exports.unpublishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to unpublish this course'
      });
    }

    await course.unpublish();

    res.status(200).json({
      success: true,
      message: 'Course unpublished successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add module to course
// @route   POST /api/courses/:id/modules
// @access  Private/Teacher
exports.addModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    const module = await course.addModule(req.body);

    res.status(201).json({
      success: true,
      message: 'Module added successfully',
      module,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update module
// @route   PUT /api/courses/:id/modules/:moduleId
// @access  Private/Teacher
exports.updateModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    const module = course.modules.id(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    Object.assign(module, req.body);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      module,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete module
// @route   DELETE /api/courses/:id/modules/:moduleId
// @access  Private/Teacher
exports.deleteModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    course.modules.id(req.params.moduleId).remove();
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Module deleted successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add lesson to module
// @route   POST /api/courses/:id/modules/:moduleId/lessons
// @access  Private/Teacher
exports.addLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    const lesson = await course.addLesson(req.params.moduleId, req.body);

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      lesson,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/courses/:id/modules/:moduleId/lessons/:lessonId
// @access  Private/Teacher
exports.updateLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    const module = course.modules.id(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const lesson = module.lessons.id(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    Object.assign(lesson, req.body);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      lesson,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/courses/:id/modules/:moduleId/lessons/:lessonId
// @access  Private/Teacher
exports.deleteLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    const module = course.modules.id(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    module.lessons.id(req.params.lessonId).remove();
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};
