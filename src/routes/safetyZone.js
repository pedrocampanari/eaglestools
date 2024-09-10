const express = require('express');
const router = express.Router();

router.get('/safetyZone/config/root/', (req, res)=>{
    res.sendFile('C:/Users/pedro/OneDrive/Área de Trabalho/projetos-exe/eaglestools/public/html/config.html');
});

router.get('/safetyZone/config/root/js/', (req, res)=>{
    res.sendFile('C:/Users/pedro/OneDrive/Área de Trabalho/projetos-exe/eaglestools/public/js/config.js');
});


module.exports = router;
