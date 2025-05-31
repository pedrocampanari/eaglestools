const mongoose = require('mongoose');
const express = require('express');
const app = express();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const http = require("http");
const WebSocket = require("ws");



const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const REPO_PATH = path.join(__dirname, "../eaglesfiles");

//Routes added
const databaseRouteTasks = require('./src/database/tasks');
const databaseRouteUsers = require('./src/database/users');
const schemas = require('./src/database/schemas');
const { decode } = require('punycode');

app.use(express.urlencoded({ extended: true }));
app.use(databaseRouteTasks);
app.use(databaseRouteUsers);

const URI = 'mongodb+srv://pedrocampanari09:QukKUKWTRs9HdlaR@eaglestools.8tzckzv.mongodb.net/?retryWrites=true&w=majority&appName=eaglestools'
mongoose.connect(URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})

app.get('/eagleschat', (req, res)=>{
    res.sendFile(__dirname + '/public/html/eagleschat.html');
});

app.get('/tools/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await schemas.User.findById(id);
        console.log(user)
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

    console.log(email, password)
    const user = await schemas.User.findOne({ email: email });
    console.log(user)

    if (user == null) {
        res.status(400).send({ message: "User não encontrado!" });
    } else if (user.email == email && user.password == password) {
        console.log('OK');
        res.json({ redirectUrl: '/tools/' + user._id, status: 200 });
    } else {
        res.json({ message: 'Usuário ou senha inválido!', status: 404 });
    }


});


app.get('/lastCommits', async (req, res) => {
    const owner = 'pedrocampanari';
    const repo = 'eaglesfiles';
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });
        const data = await response.json();
        const lastCommits = data.map((element) => {
            return {
                date: element.commit.author.date,
                message: element.commit.message
            };
        });
        res.json(lastCommits.slice(0, 5));
    } catch (err) {
        console.log(err);
    }

});

app.post("/code-dropzone-update", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("Nenhum arquivo enviado.");
    }

    const arquivo = req.file;
    const uploadPath = path.join(REPO_PATH, arquivo.originalname);
    const data = arquivo.buffer;

    // Se o arquivo já existir, excluí-lo
    if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
    }

    // Escrever o arquivo no diretório de destino
    fs.writeFileSync(uploadPath, data);
    return res.status(200).send('Arquivo salvo! Aguarde envio ao GitHub');

});

app.post('/commit-files', (req, res) => {
    exec(
        `cd ${REPO_PATH} && git pull origin main && git add . && git commit -m "${req.body.message}" && git push origin main`,
        (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: `Erro ao executar comando Git: Everything up-to-date` });
            }

            if (stderr && !stderr.includes("Everything up-to-date") && !stderr.includes("nothing to commit")) {
                console.log('Envio- GITHUB: OK');
                return res.status(200).json({ message: `Commit realizado com alerta: ${stderr}` });
            }

            console.log('Envio GITHUB: OK');
            res.json({ message: `Arquivo enviado e commit realizado com sucesso!\n${stdout}` });
        }
    );
})

app.get('/tableDaily/', (req, res) => {
    res.sendFile(__dirname + '/public/html/table.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/login.html');
    //res.redirect('/tools/66db58e99cbab46eae150152')
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



function broadcast(data, sender) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client !== sender) {
            client.send(data);
        }
    });
}


const messageSchema = new mongoose.Schema({
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

wss.on('connection', async (ws) => {
    console.log('🟢 Novo cliente conectado');

    const history = await Message.find().sort({ timestamp: 1 }).limit(50);
    history.forEach(msg => {
        ws.send(`[Histórico] ${msg.sender}: ${msg.text}`);
    });

    ws.on('message', async (message) => {
        const msgStr = message.toString(); 
        const [sender, ...rest] = msgStr.split(':');
        const text = rest.join(':').trim();

        const msgDoc = new Message({
            sender: (sender || 'Anônimo').trim(),
            text: text,
        });

        try {
            await msgDoc.save();
            console.log('💾 Mensagem salva no MongoDB');
        } catch (err) {
            console.error('❌ Erro ao salvar mensagem:', err);
        }

        broadcast(`${msgDoc.sender}: ${msgDoc.text}`, ws);
    });

    ws.on('close', () => {
        console.log('🔴 Cliente desconectado');
    });
});



server.listen(443, '0.0.0.0', () => {
    console.log('Server is running on port 443');
});