const express = require('express');
const router = express.Router();
const { protect, authorize, checkCourseAccess } = require('../middleware/auth');
const { createCourseValidation, validate, validateObjectId } = require('../middleware/validator');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  publishCourse,
  unpublishCourse,
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/courses');

// Public routes
router.get('/', getCourses);
router.get('/:id', validateObjectId('id'), validate, getCourse);

// Protected routes
router.use(protect);

// Student routes
router.post('/:id/enroll', validateObjectId('id'), validate, enrollCourse);
router.delete('/:id/enroll', validateObjectId('id'), validate, unenrollCourse);

// Teacher/Admin routes
router.post('/', authorize('teacher', 'admin'), createCourseValidation, validate, createCourse);
router.put('/:id', authorize('teacher', 'admin'), validateObjectId('id'), validate, updateCourse);
router.delete('/:id', authorize('teacher', 'admin'), validateObjectId('id'), validate, deleteCourse);
router.post('/:id/publish', authorize('teacher', 'admin'), validateObjectId('id'), validate, publishCourse);
router.post('/:id/unpublish', authorize('teacher', 'admin'), validateObjectId('id'), validate, unpublishCourse);

// Module routes
router.post('/:id/modules', authorize('teacher', 'admin'), validateObjectId('id'), validate, addModule);
router.put('/:id/modules/:moduleId', authorize('teacher', 'admin'), validateObjectId('id'), validate, updateModule);
router.delete('/:id/modules/:moduleId', authorize('teacher', 'admin'), validateObjectId('id'), validate, deleteModule);

// Lesson routes
router.post('/:id/modules/:moduleId/lessons', authorize('teacher', 'admin'), validateObjectId('id'), validate, addLesson);
router.put('/:id/modules/:moduleId/lessons/:lessonId', authorize('teacher', 'admin'), validateObjectId('id'), validate, updateLesson);
router.delete('/:id/modules/:moduleId/lessons/:lessonId', authorize('teacher', 'admin'), validateObjectId('id'), validate, deleteLesson);

module.exports = router;
