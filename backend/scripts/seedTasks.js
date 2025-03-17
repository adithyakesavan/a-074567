
const mongoose = require('mongoose');
const Task = require('../models/Task');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/task-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample tasks data
const dailyTasks = [
  {
    title: 'Make breakfast and coffee',
    description: 'Prepare a healthy breakfast and brew a fresh pot of coffee to start the day',
    dueDate: new Date(new Date().setHours(7, 30, 0, 0)),
    priority: 'medium',
    completed: false,
    user: process.argv[2] // User ID passed as command line argument
  },
  {
    title: 'Check emails and respond to urgent messages',
    description: 'Review inbox and respond to any time-sensitive emails or messages',
    dueDate: new Date(new Date().setHours(9, 0, 0, 0)),
    priority: 'high',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Attend morning team meeting',
    description: 'Join the daily standup meeting with the development team',
    dueDate: new Date(new Date().setHours(10, 0, 0, 0)),
    priority: 'high',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Work on project presentation',
    description: 'Prepare slides and content for the upcoming client presentation',
    dueDate: new Date(new Date().setHours(11, 30, 0, 0)),
    priority: 'medium',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Go for a lunch break with colleagues',
    description: 'Meet team members at the cafeteria for lunch and catch up',
    dueDate: new Date(new Date().setHours(13, 0, 0, 0)),
    priority: 'low',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Follow up with clients about pending issues',
    description: 'Call clients to discuss outstanding questions and provide updates',
    dueDate: new Date(new Date().setHours(14, 30, 0, 0)),
    priority: 'high',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Exercise at the gym',
    description: 'Complete a 45-minute workout session focusing on cardio and strength training',
    dueDate: new Date(new Date().setHours(17, 0, 0, 0)),
    priority: 'medium',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Prepare dinner',
    description: 'Cook a balanced meal for dinner with fresh ingredients',
    dueDate: new Date(new Date().setHours(18, 30, 0, 0)),
    priority: 'medium',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Review tomorrow\'s schedule',
    description: 'Check calendar and prepare for upcoming meetings and deadlines',
    dueDate: new Date(new Date().setHours(20, 0, 0, 0)),
    priority: 'low',
    completed: false,
    user: process.argv[2]
  },
  {
    title: 'Read a book before bed',
    description: 'Spend 30 minutes reading to wind down before sleeping',
    dueDate: new Date(new Date().setHours(21, 30, 0, 0)),
    priority: 'low',
    completed: false,
    user: process.argv[2]
  }
];

// Seed tasks
const seedTasks = async () => {
  try {
    // Clear existing tasks for this user
    if (process.argv[2]) {
      await Task.deleteMany({ user: process.argv[2] });
      console.log('Deleted existing tasks for this user');
    }
    
    // Insert new tasks
    await Task.insertMany(dailyTasks);
    console.log('Database seeded with 10 daily tasks!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedTasks();
