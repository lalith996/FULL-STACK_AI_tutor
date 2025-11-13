const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import models
const User = require('./src/models/User')
const Course = require('./src/models/Course')
const Quiz = require('./src/models/Quiz')
const Badge = require('./src/models/Badge')
const Progress = require('./src/models/Progress')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-elearning'

// Realistic course data
const coursesData = [
  {
    title: 'Complete JavaScript Masterclass 2024',
    shortDescription: 'Master JavaScript from basics to advanced concepts with real-world projects',
    description: 'Learn JavaScript from scratch and become a professional developer. This comprehensive course covers everything from basic syntax to advanced topics like async programming, ES6+ features, and modern JavaScript frameworks. Build 10+ real-world projects and gain hands-on experience.',
    category: 'Web Development',
    level: 'beginner',
    price: 49.99,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    language: 'English',
    prerequisites: ['Basic computer knowledge', 'HTML & CSS basics'],
    learningObjectives: [
      'Master JavaScript fundamentals and ES6+ features',
      'Build interactive web applications',
      'Understand async programming and promises',
      'Work with APIs and fetch data',
      'Master DOM manipulation',
      'Learn modern JavaScript best practices'
    ],
    tags: ['JavaScript', 'Programming', 'Web Development', 'Frontend'],
    certificateAvailable: true,
    modules: [
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the core concepts of JavaScript',
        order: 1,
        lessons: [
          { title: 'Introduction to JavaScript', duration: 15, type: 'video', content: 'Introduction content', order: 1 },
          { title: 'Variables and Data Types', duration: 25, type: 'video', content: 'Variables content', order: 2 },
          { title: 'Operators and Expressions', duration: 20, type: 'video', content: 'Operators content', order: 3 },
          { title: 'Control Flow - If/Else', duration: 30, type: 'video', content: 'Control flow content', order: 4 },
          { title: 'Loops and Iteration', duration: 35, type: 'video', content: 'Loops content', order: 5 }
        ]
      },
      {
        title: 'Functions and Scope',
        description: 'Deep dive into JavaScript functions',
        order: 2,
        lessons: [
          { title: 'Function Basics', duration: 20, type: 'video', content: 'Functions content', order: 1 },
          { title: 'Arrow Functions', duration: 18, type: 'video', content: 'Arrow functions content', order: 2 },
          { title: 'Scope and Closures', duration: 30, type: 'video', content: 'Scope content', order: 3 },
          { title: 'Higher Order Functions', duration: 25, type: 'video', content: 'HOF content', order: 4 }
        ]
      },
      {
        title: 'Arrays and Objects',
        description: 'Master data structures in JavaScript',
        order: 3,
        lessons: [
          { title: 'Working with Arrays', duration: 28, type: 'video', content: 'Arrays content', order: 1 },
          { title: 'Array Methods', duration: 35, type: 'video', content: 'Array methods content', order: 2 },
          { title: 'Objects and Properties', duration: 25, type: 'video', content: 'Objects content', order: 3 },
          { title: 'Destructuring', duration: 20, type: 'video', content: 'Destructuring content', order: 4 }
        ]
      }
    ]
  },
  {
    title: 'React - The Complete Guide 2024',
    shortDescription: 'Build powerful web applications with React, Redux, and modern JavaScript',
    description: 'Master React.js and become a professional React developer. Learn React fundamentals, hooks, context API, Redux, routing, and much more. Build multiple real-world projects including a full-stack e-commerce application.',
    category: 'Web Development',
    level: 'intermediate',
    price: 79.99,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    language: 'English',
    prerequisites: ['JavaScript fundamentals', 'HTML & CSS', 'Basic programming knowledge'],
    learningObjectives: [
      'Master React fundamentals and hooks',
      'Build complex single-page applications',
      'Manage state with Redux and Context API',
      'Implement routing with React Router',
      'Connect to REST APIs',
      'Deploy React applications'
    ],
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    certificateAvailable: true,
    modules: [
      {
        title: 'React Fundamentals',
        description: 'Get started with React',
        order: 1,
        lessons: [
          { title: 'What is React?', duration: 12, type: 'video', content: 'React intro', order: 1 },
          { title: 'Components and JSX', duration: 25, type: 'video', content: 'Components content', order: 2 },
          { title: 'Props and State', duration: 30, type: 'video', content: 'Props content', order: 3 },
          { title: 'Event Handling', duration: 20, type: 'video', content: 'Events content', order: 4 }
        ]
      },
      {
        title: 'React Hooks',
        description: 'Master modern React with hooks',
        order: 2,
        lessons: [
          { title: 'useState Hook', duration: 25, type: 'video', content: 'useState content', order: 1 },
          { title: 'useEffect Hook', duration: 30, type: 'video', content: 'useEffect content', order: 2 },
          { title: 'useContext Hook', duration: 28, type: 'video', content: 'useContext content', order: 3 },
          { title: 'Custom Hooks', duration: 35, type: 'video', content: 'Custom hooks content', order: 4 }
        ]
      }
    ]
  },
  {
    title: 'Python for Data Science and Machine Learning',
    shortDescription: 'Learn Python programming and dive into data science and machine learning',
    description: 'Complete Python programming course covering data science libraries, machine learning algorithms, and real-world projects. Perfect for beginners who want to enter the data science field.',
    category: 'Data Science',
    level: 'beginner',
    price: 69.99,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    language: 'English',
    prerequisites: ['Basic mathematics', 'No programming experience required'],
    learningObjectives: [
      'Master Python programming fundamentals',
      'Work with NumPy and Pandas',
      'Create data visualizations',
      'Build machine learning models',
      'Understand ML algorithms',
      'Complete real-world data science projects'
    ],
    tags: ['Python', 'Data Science', 'Machine Learning', 'AI'],
    certificateAvailable: true,
    modules: [
      {
        title: 'Python Basics',
        description: 'Learn Python from scratch',
        order: 1,
        lessons: [
          { title: 'Python Introduction', duration: 15, type: 'video', content: 'Python intro', order: 1 },
          { title: 'Variables and Data Types', duration: 20, type: 'video', content: 'Variables', order: 2 },
          { title: 'Control Flow', duration: 25, type: 'video', content: 'Control flow', order: 3 },
          { title: 'Functions', duration: 30, type: 'video', content: 'Functions', order: 4 }
        ]
      },
      {
        title: 'Data Science Libraries',
        description: 'Master NumPy and Pandas',
        order: 2,
        lessons: [
          { title: 'NumPy Basics', duration: 28, type: 'video', content: 'NumPy', order: 1 },
          { title: 'Pandas DataFrames', duration: 35, type: 'video', content: 'Pandas', order: 2 },
          { title: 'Data Visualization', duration: 30, type: 'video', content: 'Visualization', order: 3 }
        ]
      }
    ]
  },
  {
    title: 'UI/UX Design Masterclass',
    shortDescription: 'Learn professional UI/UX design principles and create stunning interfaces',
    description: 'Complete guide to UI/UX design covering design principles, user research, wireframing, prototyping, and design tools like Figma. Create a professional portfolio.',
    category: 'Design',
    level: 'beginner',
    price: 59.99,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    language: 'English',
    prerequisites: ['Creative mindset', 'No design experience required'],
    learningObjectives: [
      'Understand UI/UX design principles',
      'Conduct user research',
      'Create wireframes and prototypes',
      'Master Figma design tool',
      'Build a professional portfolio',
      'Design responsive interfaces'
    ],
    tags: ['UI/UX', 'Design', 'Figma', 'Web Design'],
    certificateAvailable: true,
    modules: [
      {
        title: 'Design Fundamentals',
        description: 'Core design principles',
        order: 1,
        lessons: [
          { title: 'Introduction to UI/UX', duration: 18, type: 'video', content: 'UI/UX intro', order: 1 },
          { title: 'Design Principles', duration: 25, type: 'video', content: 'Principles', order: 2 },
          { title: 'Color Theory', duration: 22, type: 'video', content: 'Colors', order: 3 },
          { title: 'Typography', duration: 20, type: 'video', content: 'Typography', order: 4 }
        ]
      }
    ]
  },
  {
    title: 'Node.js Complete Backend Development',
    shortDescription: 'Build scalable backend applications with Node.js, Express, and MongoDB',
    description: 'Master backend development with Node.js. Learn Express framework, MongoDB database, RESTful APIs, authentication, and deploy production-ready applications.',
    category: 'Web Development',
    level: 'intermediate',
    price: 64.99,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    language: 'English',
    prerequisites: ['JavaScript knowledge', 'Basic web development'],
    learningObjectives: [
      'Build RESTful APIs with Express',
      'Work with MongoDB database',
      'Implement authentication & authorization',
      'Handle file uploads',
      'Deploy Node.js applications',
      'Best practices and security'
    ],
    tags: ['Node.js', 'Backend', 'Express', 'MongoDB', 'API'],
    certificateAvailable: true,
    modules: [
      {
        title: 'Node.js Fundamentals',
        description: 'Get started with Node.js',
        order: 1,
        lessons: [
          { title: 'Node.js Introduction', duration: 15, type: 'video', content: 'Node intro', order: 1 },
          { title: 'NPM and Modules', duration: 20, type: 'video', content: 'NPM', order: 2 },
          { title: 'Async Programming', duration: 30, type: 'video', content: 'Async', order: 3 }
        ]
      }
    ]
  }
]

// Badge data
const badgesData = [
  { name: 'First Steps', description: 'Complete your first lesson', category: 'achievement', rarity: 'common', points: 10, criteria: { type: 'lesson_completion', value: 1 } },
  { name: 'Course Starter', description: 'Enroll in your first course', category: 'milestone', rarity: 'common', points: 15, criteria: { type: 'course_enrollment', value: 1 } },
  { name: 'Quick Learner', description: 'Complete 5 lessons in one day', category: 'speed', rarity: 'uncommon', points: 25, criteria: { type: 'daily_lessons', value: 5 } },
  { name: 'Dedicated Student', description: 'Maintain a 7-day learning streak', category: 'streak', rarity: 'uncommon', points: 50, criteria: { type: 'streak', value: 7 } },
  { name: 'Course Completer', description: 'Complete your first course', category: 'milestone', rarity: 'rare', points: 100, criteria: { type: 'course_completion', value: 1 } },
  { name: 'Quiz Master', description: 'Score 100% on any quiz', category: 'quiz-mastery', rarity: 'rare', points: 75, criteria: { type: 'perfect_quiz', value: 1 } },
  { name: 'Knowledge Seeker', description: 'Complete 10 courses', category: 'milestone', rarity: 'epic', points: 500, criteria: { type: 'course_completion', value: 10 } },
  { name: 'Unstoppable', description: 'Maintain a 30-day streak', category: 'streak', rarity: 'epic', points: 300, criteria: { type: 'streak', value: 30 } },
  { name: 'True Master', description: 'Complete 25 courses', category: 'milestone', rarity: 'legendary', points: 1000, criteria: { type: 'course_completion', value: 25 } },
  { name: 'Speed Demon', description: 'Complete a course in under 7 days', category: 'speed', rarity: 'rare', points: 150, criteria: { type: 'quick_completion', value: 7 } }
]

// User data
const usersData = [
  { name: 'John Smith', email: 'john@example.com', password: 'password123', role: 'student' },
  { name: 'Emma Johnson', email: 'emma@example.com', password: 'password123', role: 'student' },
  { name: 'Michael Brown', email: 'michael@example.com', password: 'password123', role: 'student' },
  { name: 'Sarah Davis', email: 'sarah@example.com', password: 'password123', role: 'teacher' },
  { name: 'Dr. James Wilson', email: 'james@example.com', password: 'password123', role: 'teacher' },
  { name: 'Lisa Anderson', email: 'lisa@example.com', password: 'password123', role: 'student' },
  { name: 'David Martinez', email: 'david@example.com', password: 'password123', role: 'student' },
  { name: 'Prof. Emily Taylor', email: 'emily@example.com', password: 'password123', role: 'teacher' }
]

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await User.deleteMany({})
    await Course.deleteMany({})
    await Quiz.deleteMany({})
    await Badge.deleteMany({})
    await Progress.deleteMany({})
    console.log('✅ Existing data cleared')

    // Create badges
    console.log('🏆 Creating badges...')
    const badges = await Badge.insertMany(badgesData)
    console.log(`✅ Created ${badges.length} badges`)

    // Create users
    console.log('👥 Creating users...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const users = await Promise.all(
      usersData.map(async (userData) => {
        const user = new User({
          ...userData,
          password: hashedPassword,
          profile: {
            bio: userData.role === 'teacher'
              ? `Experienced ${coursesData[Math.floor(Math.random() * 3)].category} instructor with 5+ years of teaching experience.`
              : 'Passionate learner always eager to expand my knowledge.',
            points: Math.floor(Math.random() * 500),
            level: Math.floor(Math.random() * 10) + 1,
            badges: badges.slice(0, Math.floor(Math.random() * 3)).map(b => b._id),
            streak: {
              current: Math.floor(Math.random() * 15),
              longest: Math.floor(Math.random() * 30) + 5
            },
            lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          }
        })
        await user.save()
        return user
      })
    )
    console.log(`✅ Created ${users.length} users`)

    const teachers = users.filter(u => u.role === 'teacher')
    const students = users.filter(u => u.role === 'student')

    // Create courses
    console.log('📚 Creating courses...')
    const courses = await Promise.all(
      coursesData.map(async (courseData, index) => {
        const teacher = teachers[index % teachers.length]
        const course = new Course({
          ...courseData,
          instructor: teacher._id,
          published: true,
          studentsEnrolled: Math.floor(Math.random() * 500) + 50,
          rating: {
            average: (Math.random() * 1.5 + 3.5).toFixed(1),
            count: Math.floor(Math.random() * 200) + 20
          }
        })
        await course.save()

        // Add some realistic reviews
        const numReviews = Math.floor(Math.random() * 5) + 2
        for (let i = 0; i < numReviews; i++) {
          const reviewer = students[Math.floor(Math.random() * students.length)]
          course.reviews.push({
            userId: reviewer._id,
            userName: reviewer.name,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            comment: [
              'Excellent course! Very well explained and easy to follow.',
              'Great content and practical examples. Highly recommended!',
              'The instructor is knowledgeable and the pace is perfect.',
              'Best course I\'ve taken on this topic. Worth every penny!',
              'Clear explanations and good project examples.',
              'Very comprehensive and well-structured course.'
            ][Math.floor(Math.random() * 6)],
            helpful: Math.floor(Math.random() * 50),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          })
        }
        await course.save()
        return course
      })
    )
    console.log(`✅ Created ${courses.length} courses`)

    // Enroll students in courses
    console.log('📝 Enrolling students in courses...')
    for (const student of students) {
      const numEnrollments = Math.floor(Math.random() * 3) + 1
      const enrolledCourses = courses.slice(0, numEnrollments)

      for (const course of enrolledCourses) {
        student.enrolledCourses.push({
          course: course._id,
          enrolledAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
          progress: Math.floor(Math.random() * 100),
          lastAccessedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        })

        // Create progress records
        const completedLessons = Math.floor(Math.random() * course.modules.reduce((sum, m) => sum + m.lessons.length, 0))
        let lessonCount = 0

        for (const module of course.modules) {
          for (const lesson of module.lessons) {
            if (lessonCount < completedLessons) {
              const progress = await Progress.create({
                user: student._id,
                course: course._id,
                lesson: lesson._id,
                module: module._id,
                completed: true,
                timeSpent: Math.floor(Math.random() * 60) + 10,
                lastAccessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
              })
              lessonCount++
            }
          }
        }
      }

      await student.save()
    }
    console.log('✅ Students enrolled in courses')

    // Create quizzes
    console.log('📝 Creating quizzes...')
    for (const course of courses) {
      const numQuizzes = Math.floor(Math.random() * 2) + 1

      for (let i = 0; i < numQuizzes; i++) {
        const quiz = await Quiz.create({
          title: `${course.title} - Quiz ${i + 1}`,
          course: course._id,
          description: `Test your knowledge of ${course.modules[i % course.modules.length].title}`,
          passingScore: 70,
          timeLimit: 30,
          questions: [
            {
              question: 'Which of the following is correct?',
              type: 'multiple-choice',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
              points: 10,
              explanation: 'Option B is correct because...'
            },
            {
              question: 'True or False: This is a test question?',
              type: 'true-false',
              options: ['True', 'False'],
              correctAnswer: 'True',
              points: 5,
              explanation: 'This is true because...'
            },
            {
              question: 'Explain the main concept.',
              type: 'short-answer',
              correctAnswer: 'The main concept involves...',
              points: 15,
              explanation: 'A good answer should include...'
            }
          ],
          attempts: []
        })

        // Add quiz attempts for some students
        const attemptingStudents = students.slice(0, Math.floor(Math.random() * 3) + 1)
        for (const student of attemptingStudents) {
          const score = Math.floor(Math.random() * 40) + 60 // 60-100
          quiz.attempts.push({
            userId: student._id,
            score: score,
            answers: quiz.questions.map(q => ({
              question: q._id,
              answer: q.correctAnswer,
              correct: Math.random() > 0.3
            })),
            timeSpent: Math.floor(Math.random() * 25) + 5,
            submittedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000)
          })
        }

        await quiz.save()
      }
    }
    console.log('✅ Quizzes created')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Users: ${users.length} (${students.length} students, ${teachers.length} teachers)`)
    console.log(`   Courses: ${courses.length}`)
    console.log(`   Badges: ${badges.length}`)
    console.log(`   Quizzes: ${courses.length * 1.5} (approx)`)
    console.log('\n🔐 Login credentials for testing:')
    console.log('   Student: john@example.com / password123')
    console.log('   Teacher: sarah@example.com / password123')
    console.log('\n✨ You can now start the server and explore the platform!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('\n👋 Database connection closed')
  }
}

// Run the seed function
seedDatabase()
