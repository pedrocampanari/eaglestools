const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/eaglestools').then(()=>{
    console.log('Connected to MongoDB');
}).catch(err =>{
    console.log(err);
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/html/index.html');
});

app.listen(3000, '0.0.0.0', ()=>{
    console.log('Server is running on port 3000');
});