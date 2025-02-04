const mongoose = require('mongoose');
const express = require('express');
const app = express();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

app.use(express.json());
app.use(express.static('public'));


// Configuração do multer para processar o arquivo
const storage = multer.memoryStorage();  // Usando memória para o arquivo
const upload = multer({ storage: storage })


//Routes added
const databaseRouteTasks = require('./src/database/tasks');
const databaseRouteUsers = require('./src/database/users');
const schemas = require('./src/database/schemas');

app.use(express.urlencoded({ extended: true }));
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
        const response = await fetch(url);
        const data = await response.json();
        const lastCommits = data.map((element) => {
            return {
                date: element.commit.author.date,
                message: element.commit.message
            };
        });
        res.json(lastCommits.slice(0,5));
    } catch (err) {
        console.log(err);
    }

});




























const REPO_PATH = path.join(__dirname, "eaglesfiles");

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

app.post('/commit-files', (req, res)=>{
    exec(
        `cd ${REPO_PATH} && git add . && git commit -m "${req.body.message}" && git push origin main`,
        (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({message: `Erro ao executar comando Git: Everything up-to-date`});
            }

            if (stderr && !stderr.includes("Everything up-to-date") && !stderr.includes("nothing to commit")) {
                return res.status(200).json({message: `Commit realizado com alerta: ${stderr}`});
            }

            res.json({message:`Arquivo enviado e commit realizado com sucesso!\n${stdout}`});
        }
    );
})



































app.get('/tableDaily/', (req, res) => {
    res.sendFile(__dirname + '/public/html/table.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/signup.html');
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


app.listen(80, '0.0.0.0', () => {
    console.log('Server is running on port 80');
});