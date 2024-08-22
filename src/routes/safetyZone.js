const express = require('express');
const router = express.Router();

router.get('/safetyZone/config/root/', (req, res)=>{
    res.sendFile('C:/Users/pedro/OneDrive/Área de Trabalho/projetos-exe/eaglestools/public/html/config.html');
});


module.exports = router;
