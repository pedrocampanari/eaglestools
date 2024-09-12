const express = require('express');
const router = express.Router();

router.get('/safetyZone/config/root/', (req, res)=>{
    res.sendFile(__dirname + '/public/html/config.html');
});

router.get('/safetyZone/config/root/js/', (req, res)=>{
    res.sendFile(__dirname + '/public/js/config.js');
});


module.exports = router;
