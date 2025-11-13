# Database Setup Guide

## Quick Start

### 1. Prerequisites
- MongoDB installed and running locally OR MongoDB Atlas account
- Node.js v18+ installed

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-elearning
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-elearning

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI API (Optional - for AI features)
OPENAI_API_KEY=your-openai-api-key

# CORS Origin
CORS_ORIGIN=http://localhost:5173
```

### 3. Seed the Database

Run the following command to populate the database with realistic synthetic data:

```bash
npm run seed
```

This will create:
- **8 users** (5 students + 3 teachers)
- **5 complete courses** with multiple modules and lessons
- **10 badges** for gamification
- **Progress records** showing realistic student activity
- **Quiz attempts** with scores
- **Course reviews** with ratings

### 4. Test Login Credentials

After seeding, you can log in with these accounts:

**Student Account:**
- Email: `john@example.com`
- Password: `password123`

**Teacher Account:**
- Email: `sarah@example.com`
- Password: `password123`

**Additional Test Accounts:**
- `emma@example.com` / `password123` (Student)
- `michael@example.com` / `password123` (Student)
- `james@example.com` / `password123` (Teacher)
- `emily@example.com` / `password123` (Teacher)

## Database Schema Overview

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'teacher' | 'admin',
  profile: {
    bio: String,
    avatar: String,
    points: Number,
    level: Number,
    badges: [Badge IDs],
    streak: {
      current: Number,
      longest: Number
    },
    lastActivity: Date
  },
  enrolledCourses: [{
    course: Course ID,
    enrolledAt: Date,
    progress: Number,
    lastAccessedAt: Date
  }]
}
```

### Courses Collection
```javascript
{
  title: String,
  shortDescription: String,
  description: String,
  instructor: User ID,
  category: String,
  level: 'beginner' | 'intermediate' | 'advanced',
  price: Number,
  thumbnail: String,
  modules: [{
    title: String,
    description: String,
    order: Number,
    lessons: [{
      title: String,
      duration: Number,
      type: 'video' | 'text' | 'quiz',
      content: String,
      order: Number
    }]
  }],
  rating: {
    average: Number,
    count: Number
  },
  reviews: [{
    userId: User ID,
    userName: String,
    rating: Number,
    comment: String,
    helpful: Number,
    createdAt: Date
  }],
  studentsEnrolled: Number,
  published: Boolean
}
```

### Progress Collection
```javascript
{
  user: User ID,
  course: Course ID,
  lesson: Lesson ID,
  module: Module ID,
  completed: Boolean,
  timeSpent: Number,
  lastAccessed: Date
}
```

### Quiz Collection
```javascript
{
  title: String,
  course: Course ID,
  description: String,
  passingScore: Number,
  timeLimit: Number,
  questions: [{
    question: String,
    type: 'multiple-choice' | 'true-false' | 'short-answer',
    options: [String],
    correctAnswer: String,
    points: Number,
    explanation: String
  }],
  attempts: [{
    userId: User ID,
    score: Number,
    answers: [{
      question: Question ID,
      answer: String,
      correct: Boolean
    }],
    timeSpent: Number,
    submittedAt: Date
  }]
}
```

### Badges Collection
```javascript
{
  name: String,
  description: String,
  category: String,
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
  points: Number,
  criteria: {
    type: String,
    value: Number
  }
}
```

## Sample Data Details

### Courses
1. **Complete JavaScript Masterclass 2024** (Beginner, $49.99)
   - 3 modules, 13 lessons
   - Category: Web Development

2. **React - The Complete Guide 2024** (Intermediate, $79.99)
   - 2 modules, 8 lessons
   - Category: Web Development

3. **Python for Data Science and Machine Learning** (Beginner, $69.99)
   - 2 modules, 7 lessons
   - Category: Data Science

4. **UI/UX Design Masterclass** (Beginner, $59.99)
   - 1 module, 4 lessons
   - Category: Design

5. **Node.js Complete Backend Development** (Intermediate, $64.99)
   - 1 module, 3 lessons
   - Category: Web Development

### Badges Hierarchy
- **Common**: First Steps, Course Starter
- **Uncommon**: Quick Learner, Dedicated Student
- **Rare**: Course Completer, Quiz Master, Speed Demon
- **Epic**: Knowledge Seeker, Unstoppable
- **Legendary**: True Master

## Useful Commands

```bash
# Seed database
npm run seed

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify MONGODB_URI in `.env` file
- Check firewall settings

### Seeding Errors
- Delete existing data first: The seed script automatically clears old data
- Check console output for specific error messages
- Ensure all npm packages are installed: `npm install`

### Authentication Issues
- JWT_SECRET must be set in `.env`
- Passwords are hashed with bcrypt
- Default password for all test accounts: `password123`

## Next Steps

After setting up the database:

1. Start the backend server: `npm run dev`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Navigate to http://localhost:5173
4. Log in with test credentials
5. Explore courses, enroll, and test features

## Production Deployment

For production:

1. Use MongoDB Atlas for hosted database
2. Change JWT_SECRET to a strong random string
3. Update CORS_ORIGIN to your production URL
4. Set NODE_ENV=production
5. Never commit `.env` file to version control
6. Use environment variables in your hosting platform

## Support

For issues or questions:
- Check logs in the backend console
- Review MongoDB connection status
- Ensure all environment variables are set
- Verify Node.js and MongoDB versions match requirements
