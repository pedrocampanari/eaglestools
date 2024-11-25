const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));


//Routes added
const databaseRouteTasks = require('./src/database/tasks');
const databaseRouteUsers = require('./src/database/users');
const schemas = require('./src/database/schemas');


app.use(databaseRouteTasks);
app.use(databaseRouteUsers);


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

app.post('/login/', async (req, res) => {
    const { email, password } = req.body;
    const user = await schemas.User.findOne({ email: email });
    console.log(user)

    if (user == null){
        res.status(400).send({ message: "User não encontrado!" });
    }else if (user.email == email && user.password == password) {
        console.log('OK');
        res.json({ redirectUrl: '/tools/' + user._id, status: 200 });
    } else {
        res.json({ message: 'Usuário ou senha inválido!', status: 404 });
    }


});


app.get('/tableDaily/', (req, res) => {
    res.sendFile(__dirname + '/public/html/table.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/signup.html');
});

app.get('/safetyZone/config/root/', (req, res) => {
    res.sendFile(__dirname + '/public/html/config.html');
});

app.get('/safetyZone/config/root/js/', (req, res) => {
    res.sendFile(__dirname + '/public/js/config.js');
});

app.get('/allposts/', (req, res) => {
    res.sendFile(__dirname + '/public/html/allposts.html');
})

setInterval(async () => {
    try {
        const tasks = await schemas.Task.find({ concluded: false });

        tasks.forEach(async (element) => {
            const now = new Date();
            const term = new Date(element.term);
            const newStatus = now > term ? false : true;
            await element.updateOne({ status: newStatus });
            console.log(`Task updated: ${element._id}, new status: ${newStatus}`);
        });

        console.log('Updating...');
    } catch (err) {
        console.error('Error while updating tasks:', err);
    }
}, 60000);


app.listen(80, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});