
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    const newTask = new Task({
      title,
      description,
      user: req.user._id,
      dueDate,
      priority
    });
    
    const task = await newTask.save();
    
    // Send email notification about new task
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'New Task Created',
      text: `You have created a new task: ${title}. Due date: ${new Date(dueDate).toLocaleString()}`
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email error:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
    // Schedule a reminder email
    const dueTime = new Date(dueDate).getTime();
    const reminderTime = dueTime - (5 * 60 * 1000); // 5 minutes before due
    const now = Date.now();
    
    if (reminderTime > now) {
      setTimeout(() => {
        const reminderMailOptions = {
          from: process.env.EMAIL_USER,
          to: req.user.email,
          subject: 'Task Due Soon',
          text: `Reminder: Your task "${title}" is due in 5 minutes.`
        };
        
        transporter.sendMail(reminderMailOptions, (err, info) => {
          if (err) {
            console.error('Reminder email error:', err);
          } else {
            console.log('Reminder email sent:', info.response);
          }
        });
      }, reminderTime - now);
    }
    
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update fields
    const { title, description, dueDate, priority, completed } = req.body;
    
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (completed !== undefined) task.completed = completed;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
