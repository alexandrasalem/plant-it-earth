var express = require('express');
var router = express.Router();
var path = require('path');
const { fileURLToPath } = require('url');
const url = require('url'); 
const fetch= require("node-fetch");
const token= require('../credentials');
const desiredSections= ["common_name", "year", "bibliography", "sources"]


router.get('/', function (req,res) {
    res.status(320);
    res.redirect('/'); //returns to the home url
});

router.get('/:id', function (req,res) {
    let id= (req.url.split('/'))[1];
    const trefleQuery= 'https://trefle.io/api/v1/plants/'+id+`/?token=${token}`;
    
    fetch(trefleQuery)
    .then(res => res.json())
    .then((data)=> {
        console.log(data);
        if(data.error){
            res.render('error', {message: data.message});
        }
        else{
        res.render('plant', {result: data.data, sections: desiredSections});
        }
    })
})

module.exports = router;