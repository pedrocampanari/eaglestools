const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const schemas = require('../database/schemas');


router.post('/api/tasks/', async (req, res)=>{
    const memberTasks = await schemas.Task.find({user: req.body.id, conclused: false});
    res.json(memberTasks);
});

router.get('/api/tasks/getAll/', async (req, res)=>{
    try{
        const tasks = await schemas.Task.find();
        res.json(tasks);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.post('/api/task/addTask/', async (req, res)=>{
    try {
        const newTask = new schemas.Task(req.body);
        await newTask.save();
        res.json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/api/task/removeTask/', async (req, res) => {
    try {
        await schemas.Task.deleteOne({_id: req.body.id});
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task' });
    }
})



module.exports = router;