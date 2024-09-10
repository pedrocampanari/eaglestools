const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));


//Routes added
const databaseRouteTasks = require('./src/database/tasks');
const databaseRouteUsers = require('./src/database/users');
const safetyZoneRoute = require('./src/routes/safetyZone');
const schemas = require('./src/database/schemas');


app.use(databaseRouteTasks);
app.use(databaseRouteUsers);
app.use(safetyZoneRoute);


//Connect to MongoDb
mongoose.connect("mongodb://localhost:27017/eaglestools").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})


app.get('/tools/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await schemas.User.findById(id);
        if (user.root) {
            res.sendFile(__dirname + '/public/html/admin-dashboard.html');
        } else {
            res.sendFile(__dirname + '/public/html/members-dashboard.html');
        }

    } catch (err) {
        console.log(err);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await schemas.User.findOne({ email: email });
    console.log(user)

    if (user.email == email && user.password == password) {
        console.log('OK');
        res.json({ redirectUrl: '/tools/' + user._id, status: 200});
    } else {
        res.json({ message: 'Invalid username or password', status: 404 });
    }


});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/login.html');
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});