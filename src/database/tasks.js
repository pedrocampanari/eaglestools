const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const schemas = require('../database/schemas');


router.post('/api/tasks/', async (req, res) => {
    const memberTasks = await schemas.Task.find({ user: req.body.id, concluded: false }).sort({ term: 1 });
    res.json(memberTasks);
});

router.get('/api/tasks/', async (req, res) => {
    const memberTasks = await schemas.Task.find({ concluded: false }).sort({ term: 1 });
    res.json(memberTasks);
});

router.post('/api/tasks/concludedAll/', async (req, res) => {
    const memberTasks = await schemas.Task.find({ user: req.body.id, concluded: true }).sort({ completionDate: 1 });
    res.json(memberTasks);
});

router.get('/api/tasks/concludedAll/', async (req, res) => {
    try {
        const task = await schemas.Task.find({ concluded: true });
        res.json(task);
    } catch (error) {
        res.status(404).json({ message: 'Task not found' });
    }
});

router.get('/api/task/concluded/:id', async (req, res) => {
    try {
        const task = await schemas.Task.findById(req.params.id);
        res.json(task);
    } catch (error) {
        res.status(404).json({ message: 'Task not found' });
    }
});

router.post('/api/task/concluded/:id', async (req, res) => {
    try {
        const task = await schemas.Task.findByIdAndUpdate(req.params.id, { concluded: true });
        const taskDescription = await schemas.Task.findByIdAndUpdate(req.params.id, { description: req.body.description, completionDate: new Date() });
        res.json(taskDescription);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/api/tasks/getAll/', async (req, res) => {
    try {
        const tasks = await schemas.Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/api/task/addTask/', async (req, res) => {
    try {
        const newTask = new schemas.Task(req.body);
        const ownerNameQuery = await schemas.User.findById(req.body.ownerName);
        newTask.ownerName = ownerNameQuery.name;
        await newTask.save();
        res.json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/api/task/dailyTasks', async (req, res) => {
    const today = new Date();
    today.setHours(23, 59, 59, 0);
  
    try {
      const tasks = await schemas.Task.find({ term: { $lte: today, $gte: new Date().setHours(0,0,0,0)} }).sort({ownerName: 1});
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.delete('/api/task/removeTask/', async (req, res) => {
    try {
        await schemas.Task.deleteOne({ _id: req.body.id });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task' });
    }
})



module.exports = router;