const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dynamixlms';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In a real app, send a JWT token here
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      password, // In a real app, hash this!
      role,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`
    });

    await newUser.save();
    
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    
    // Auto enroll students in the demo course
    if (role === 'STUDENT') {
        const demoCourse = await Course.findOne(); // Just pick first one
        if (demoCourse) {
             await new Enrollment({
                 userId: newUser.id,
                 courseId: demoCourse.id,
                 progress: 0,
                 completedModuleIds: []
             }).save();
        }
    }

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, avatarUrl } = req.body;
    const id = req.params.id;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase();
      const existing = await User.findOne({ email: normalizedEmail, id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = normalizedEmail;
    }
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const updatedUser = await User.findOneAndUpdate({ id }, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const courseData = req.body;
    const newCourse = new Course({
        ...courseData,
        id: courseData.id || `c-${Date.now()}` // Use provided ID or generate
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const updated = await Course.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enrollments
app.get('/api/enrollments', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const enrollments = await Enrollment.find({ userId });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/enrollments', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) return res.json(existing);

    const newEnrollment = new Enrollment({
      userId,
      courseId,
      progress: 0,
      completedModuleIds: []
    });
    await newEnrollment.save();
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/enrollments/progress', async (req, res) => {
  try {
    const { userId, courseId, moduleId } = req.body;
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    if (!enrollment.completedModuleIds.includes(moduleId)) {
      enrollment.completedModuleIds.push(moduleId);
      
      // Recalculate progress
      const course = await Course.findOne({ id: courseId });
      if (course) {
        enrollment.progress = Math.round((enrollment.completedModuleIds.length / course.modules.length) * 100);
      }
      await enrollment.save();
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed Data Helper
async function seedData() {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Seeding Users...');
    await User.insertMany([
        { id: 's1', name: 'John Student', email: 'student@demo.com', password: 'password', role: 'STUDENT', avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=JohnStudent` },
        { id: 't1', name: 'Sarah Tech', email: 'teacher@demo.com', password: 'password', role: 'TEACHER', avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=SarahTech` }
    ]);
  }

  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    console.log('Seeding Courses...');
    await Course.insertMany([
        {
            id: 'c1',
            title: 'Modern Web Development',
            description: 'Learn React, TypeScript, and Tailwind CSS to build modern web apps.',
            instructorId: 't1',
            instructorName: 'Sarah Tech',
            category: 'Development',
            thumbnailUrl: 'https://picsum.photos/seed/webdev/400/250',
            modules: [
                { 
                    id: 'm1', 
                    title: 'Introduction to React', 
                    content: 'React is a library for building user interfaces...',
                    quiz: [
                        { question: "What is React mainly used for?", options: ["Building databases", "Building user interfaces", "Managing server logic", "Editing photos"], correctAnswerIndex: 1 },
                        { question: "What are the building blocks of a React application called?", options: ["Blocks", "Elements", "Components", "Modules"], correctAnswerIndex: 2 }
                    ]
                },
                { 
                    id: 'm2', 
                    title: 'State and Props', 
                    content: 'Understanding how data flows in a React application is crucial...',
                    quiz: [
                        { question: "Are props mutable?", options: ["Yes", "No", "Sometimes", "Only in class components"], correctAnswerIndex: 1 }
                    ]
                }
            ]
        },
        {
            id: 'c2',
            title: 'Data Science Fundamentals',
            description: 'An introduction to Python, Pandas, and data visualization techniques.',
            instructorId: 't1',
            instructorName: 'Sarah Tech',
            category: 'Data Science',
            thumbnailUrl: 'https://picsum.photos/seed/datascience/400/250',
            modules: [
                { 
                    id: 'm3', 
                    title: 'Python Basics', 
                    content: 'Variables, loops, and functions in Python...',
                    quiz: [
                        { question: "Who created Python?", options: ["Elon Musk", "Guido van Rossum", "Mark Zuckerberg", "Bill Gates"], correctAnswerIndex: 1 }
                    ]
                }
            ]
        }
    ]);
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));