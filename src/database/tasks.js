const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const schemas = require('../database/schemas');


router.post('/api/tasks/', async (req, res) => {
    const memberTasks = await schemas.Task.find({ user: { $in: [req.body.id] }, concluded: false }).sort({ term: 1 });
    res.json(memberTasks);
});

router.get('/api/tasks/', async (req, res) => {
    const memberTasks = await schemas.Task.find({ concluded: false }).sort({ term: 1 });
    res.json(memberTasks);
});

router.post('/api/tasks/concludedAll/', async (req, res) => {
    const memberTasks = await schemas.Task.find({ user: { $in: [req.body.id] }, concluded: true }).sort({ completionDate: 1 });
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

router.put('/api/update/task/:id', async (req, res) => {
    
    try {
        const up = req.body;
        up.completionDate = new Date();
        up.concluded = true;
  
        const task = await schemas.Task.findByIdAndUpdate(req.params.id, up);
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
        console.log(taskDescription)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/api/tasks/getAll/:id', async (req, res) => {
    try {
        const tasks = await schemas.Task.find({ user: { $in: [req.params.id] }}).sort({urgency: -1});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    };
})






















router.post('/api/task/addTask/', async (req, res) => {
    try {

        const usersTask = req.body.user;
        console.log(usersTask)
        // Aguardando todas as promessas
        const usersList = await Promise.all(usersTask.map(async (email) => {
            const user = await schemas.User.findOne({ email: email.trim() });
            return user ? user.id : null; // Caso o usuário não seja encontrado
        }));

        // Criando a nova tarefa
        const newTask = new schemas.Task(req.body);
        newTask.user = usersList;
        await newTask.save(); // Salva a tarefa no banco de dados

        res.status(200).json({ 
            status: 200,
            message: "Task added successfully", 
            task: newTask 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
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