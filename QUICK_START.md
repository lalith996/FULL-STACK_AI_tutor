# 🚀 Quick Start Guide - AI E-Learning Platform

Get your AI-powered e-learning platform up and running in minutes!

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

## 1️⃣ Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd FULL-STACK_AI_tutor

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2️⃣ Configure Backend

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your settings (use nano, vim, or any editor)
nano .env
```

**Minimum required configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/ai-elearning
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
CLIENT_URL=http://localhost:5173
```

## 3️⃣ Seed Database

```bash
# Still in backend directory
npm run seed
```

This creates:
- ✅ 8 users (5 students, 3 teachers)
- ✅ 5 complete courses
- ✅ 10 achievement badges
- ✅ Progress records
- ✅ Quiz attempts
- ✅ Course reviews

## 4️⃣ Start Development Servers

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
App runs on: http://localhost:5173

## 5️⃣ Login & Explore

Navigate to http://localhost:5173

**Test Accounts:**

| Role | Email | Password |
|------|-------|----------|
| Student | john@example.com | password123 |
| Teacher | sarah@example.com | password123 |
| Student | emma@example.com | password123 |
| Teacher | james@example.com | password123 |

## 🎯 What to Try

### As a Student:
1. Browse courses catalog
2. Enroll in a course
3. Complete lessons and track progress
4. Take quizzes
5. Check your dashboard analytics
6. Try the Interactive Learning Hub:
   - Code Playground
   - Pomodoro Study Timer
   - AI Learning Path Recommender
   - Notes & Bookmarks
   - Spaced Repetition System

### As a Teacher:
1. View teacher dashboard
2. Create a new course
3. Add modules and lessons
4. View student enrollments
5. Respond to course reviews

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (Mac/Linux)
mongod

# Start MongoDB (Windows)
net start MongoDB
```

### Port Already in Use
```bash
# Backend (change PORT in .env)
PORT=5001

# Frontend (change in vite.config.ts)
server: { port: 3000 }
```

### Dependencies Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Features Overview

### Core Features
- ✅ User authentication & authorization
- ✅ Course catalog with filters & search
- ✅ Video-based learning interface
- ✅ Quiz system with multiple question types
- ✅ Progress tracking
- ✅ Course reviews & ratings

### Advanced Features
- ✅ AI-powered chatbot
- ✅ Gamification (badges, points, streaks)
- ✅ Analytics dashboard
- ✅ Interactive code playground
- ✅ Pomodoro study timer
- ✅ Spaced repetition learning
- ✅ Smart notes & bookmarks
- ✅ AI learning path recommendations

### Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Socket.io
- **State Management:** Zustand with persistence
- **Data Fetching:** React Query
- **Authentication:** JWT
- **Real-time:** Socket.io
- **AI:** OpenAI GPT-4 integration

## 📖 Documentation

- [Backend Setup](./backend/DATABASE_SETUP.md)
- [API Documentation](./backend/API_DOCS.md)
- [Frontend Structure](./frontend/README.md)

## 🎨 Screenshots & Demo

After starting the app, you'll see:
- Modern, responsive UI with gradient designs
- Interactive learning tools
- Real-time progress tracking
- Gamification elements
- Analytics charts

## 🚀 Production Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or AWS
- Use MongoDB Atlas for database
- Set environment variables in hosting platform

### Frontend (React)
- Deploy to Vercel, Netlify, or AWS S3
- Build: `npm run build`
- Output: `dist/` folder

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=strong-random-secret
CLIENT_URL=https://your-domain.com
```

## 💡 Tips

1. **Keep MongoDB running** while developing
2. **Use different terminal windows** for frontend and backend
3. **Check browser console** for errors
4. **Review backend logs** for API issues
5. **Re-seed database** if data seems corrupted: `npm run seed`

## 🆘 Need Help?

- Check console logs (browser & terminal)
- Review `.env` configuration
- Ensure MongoDB is running
- Verify Node.js version: `node --version`
- Clear browser cache/cookies

## 📝 Next Steps

1. ✅ Explore all features as student/teacher
2. ✅ Test the Interactive Learning Hub
3. ✅ Try code playground with different languages
4. ✅ Complete a course and earn badges
5. ✅ Check analytics dashboard
6. 🔜 Customize courses for your needs
7. 🔜 Add your own content
8. 🔜 Deploy to production

---

**Happy Learning! 🎓✨**

For detailed information, check the specific README files in `frontend/` and `backend/` directories.
