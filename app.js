const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));


//Routes added
const databaseRouteTasks = require('./src/database/tasks');
const databaseRouteUsers = require('./src/database/users');
const safetyZoneRoute = require('./src/routes/safetyZone');

app.use(databaseRouteTasks);
app.use(databaseRouteUsers);
app.use(safetyZoneRoute);


//Connect to MongoDb
mongoose.connect("mongodb://localhost:27017/eaglestools").then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})


app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/html/members-dashboard.html');
});

app.get('/:id', (req, res)=>{
    res.sendFile(__dirname + '/public/html/config.html');
});

app.listen(3000, '0.0.0.0', ()=>{
    console.log('Server is running on port 3000');
});