const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const schemas = require('../database/schemas');

router.post('/api/user/add/', async (req, res) => {
    try {
        const user = new schemas.User(req.body);
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.get('/api/userInfo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await schemas.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        console.log(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

router.get('/api/user/getUsers/', async (req, res) => {
    try {
        const users = await schemas.User.find();
        console.log(users);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.delete('/api/user/removeUser/', async (req, res) => {
    try{
        await schemas.User.deleteOne({_id: req.body.id});
        res.status(200).json({ message: 'Users deleted successfully' });
    }catch(err){
        res.status(500).json({ message: 'Error deleting users' });
    }
})

module.exports = router;