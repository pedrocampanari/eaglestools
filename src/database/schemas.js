const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    root: Boolean,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

const taskSchema = new mongoose.Schema({
    name: String,
    ownerName: String,
    description: String,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: Boolean,
    term: Date,
    urgency: Number,
    concluded: Boolean,
    completionDate: Date
});

// Criando os modelos
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = { User, Task };