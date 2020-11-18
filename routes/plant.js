var express = require('express');
var router = express.Router();
var path = require('path');
const { fileURLToPath } = require('url');
const url = require('url'); 
const token= require('../credentials');
const trefleUrl= 'https://trefle.io/api/v1/plants?token='+token;


router.get('/', function (req,res) {
    res.status(302);
    res.redirect('/');
});

router.get('/:id', function (req,res) {
    let id= req.url.splice('/');
    console.log(queryObject, req.url);
    console.log("HELLO!?");
    // fetch()
    res.render('plant', { title: 'A Plant!'});
})

module.exports = router;