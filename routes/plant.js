var express = require('express');
var router = express.Router();
var path = require('path');
const { fileURLToPath } = require('url');
const url = require('url'); 
const token= require('../credentials');
const trefleUrl= 'https://trefle.io/api/v1/plants?token='+token;


router.get('/', function (req,res) {
    res.redirect()
});

router.get('/:id', function (req,res) {
    res.status(200);
    res.write("plant...");
    res.send();
})

module.exports = router;