# AI-Driven E-Learning Platform

A comprehensive full-stack e-learning application with AI-powered personalized learning, intelligent tutoring, and gamification features.

## Features

### Student Portal
- **Secure Authentication**: JWT-based login with role management
- **Course Management**: Browse, enroll, and track course progress
- **Interactive Learning**: Video lessons, quizzes, and assignments
- **AI Tutor**: 24/7 intelligent chatbot for instant help
- **Personalized Recommendations**: AI-driven learning path suggestions
- **Gamification**: Earn badges, points, and compete on leaderboards
- **Progress Analytics**: Visualize learning journey with charts

### Teacher Portal
- **Content Management**: Upload videos, create quizzes, and assignments
- **Course Builder**: Intuitive interface for structuring courses
- **Student Analytics**: Track student performance and engagement
- **AI Insights**: Get recommendations for struggling students
- **Grading Tools**: Automated quiz grading with manual override
- **Communication**: Announcements and direct messaging

### AI Features
- **Intelligent Tutoring**: Context-aware chatbot using GPT-4
- **Personalized Learning Paths**: ML-based course recommendations
- **Automated Feedback**: Instant quiz evaluation with explanations
- **Performance Prediction**: Identify at-risk students early
- **Content Recommendations**: Suggest supplementary materials

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for server state
- **Recharts** for analytics visualization
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for WebSocket connections
- **Multer** for file uploads
- **Bcrypt** for password hashing

### AI & ML
- **OpenAI GPT-4** for intelligent tutoring
- **TensorFlow.js** for client-side ML
- **Python Microservice** for recommendation engine (to be implemented)

### DevOps
- **Docker** for containerization
- **Docker Compose** for orchestration
- **Redis** for caching

## Project Structure

```
ai-elearning-platform/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── backend/                  # Node.js Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── docker-compose.yml       # Docker orchestration
└── README.md               # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis (optional, for caching)
- Docker (optional)

### Installation

#### Option 1: Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd FULL-STACK_AI_tutor
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables in .env
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint in .env
npm run dev
```

#### Option 2: Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Configuration

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/elearning

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:5173

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Update password

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (teacher only)
- `PUT /api/courses/:id` - Update course (teacher only)
- `DELETE /api/courses/:id` - Delete course (teacher only)
- `POST /api/courses/:id/enroll` - Enroll in course
- `DELETE /api/courses/:id/enroll` - Unenroll from course
- `POST /api/courses/:id/publish` - Publish course
- `POST /api/courses/:id/unpublish` - Unpublish course

### Quiz Endpoints
- `GET /api/quizzes?courseId=xxx` - Get course quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create quiz (teacher only)
- `PUT /api/quizzes/:id` - Update quiz (teacher only)
- `DELETE /api/quizzes/:id` - Delete quiz (teacher only)
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/attempts` - Get quiz attempts
- `GET /api/quizzes/:id/statistics` - Get quiz statistics (teacher only)

### AI Tutor Endpoints
- `POST /api/ai/chat` - Chat with AI tutor
- `GET /api/ai/recommendations` - Get personalized recommendations
- `POST /api/ai/feedback` - Get AI feedback on assignment

### Analytics Endpoints
- `GET /api/analytics/student/:id` - Get student analytics
- `GET /api/analytics/course/:id` - Get course analytics (teacher only)
- `GET /api/analytics/leaderboard` - Get global leaderboard
- `GET /api/analytics/teacher/dashboard` - Get teacher dashboard (teacher only)

### Progress Endpoints
- `GET /api/progress/:courseId` - Get user progress for a course
- `PUT /api/progress/:courseId` - Update progress
- `POST /api/progress/:courseId/lessons/:lessonId/complete` - Mark lesson as complete
- `GET /api/progress/:courseId/certificate` - Get certificate

### Badge Endpoints
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/:userId` - Get user badges
- `GET /api/badges/:id` - Get badge details
- `POST /api/badges` - Create badge (admin only)

### Review Endpoints
- `GET /api/reviews?courseId=xxx` - Get course reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

## Database Schema

### User Model
- Personal information (name, email, password)
- Role (student, teacher, admin)
- Profile (avatar, bio, level, points, badges)
- Streak tracking
- Learning preferences
- Enrolled courses

### Course Model
- Title, description, thumbnail
- Instructor reference
- Category, level, price
- Modules and lessons
- Enrolled students
- Ratings and reviews
- Publishing status

### Quiz Model
- Title, description
- Course and module references
- Questions with multiple types
- Time limit, passing score
- Attempts allowed
- Shuffle and visibility settings

### Progress Model
- User and course references
- Completed lessons tracking
- Quiz scores
- Overall progress percentage
- Certificate information

### Badge Model
- Name, description, icon
- Category and rarity
- Criteria for earning
- Points reward
- Users who earned it

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- XSS protection with helmet.js
- Input validation and sanitization
- Role-based access control (RBAC)

## Performance Optimization

- Code splitting and lazy loading
- React Query for efficient data fetching
- MongoDB indexing for faster queries
- Redis caching (optional)
- Gzip compression
- Optimized bundle size

## Roadmap

- [ ] Implement Python AI microservice for ML recommendations
- [ ] Add video upload and streaming functionality
- [ ] Implement real-time chat and notifications
- [ ] Add payment integration for course purchases
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboards
- [ ] Multi-language support
- [ ] Offline mode with PWA

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@elearning.com

## Acknowledgments

- OpenAI for GPT-4 API
- MongoDB team for excellent database
- React community for amazing ecosystem
- All contributors and testers

---

Built with ❤️ for better education through AI
