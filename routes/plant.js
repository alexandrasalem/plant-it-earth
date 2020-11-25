var express = require('express');
var router = express.Router();
var path = require('path');
const { fileURLToPath } = require('url');
const url = require('url'); 
const {token}= require('../credentials');
const queries= require("../controllers/plant");

router.get('/', function (req,res) {
    res.status(320);
    res.redirect('/'); //returns to the home url
});

router.get('/:id', function (req,res) {
    let id= (req.url.split('/'))[1];
    const trefleQuery= 'https://trefle.io/api/v1/plants/'+id+`/?token=${token}`;

    Promise.all([queries.getTrefle(trefleQuery),queries.getPlantQA(id)])
    .then(([trefleResult, dbResult]) => {
        res.render('plant', {result:trefleResult, qa: dbResult});
    })
    .catch(err => {
        res.render('error', { message: err});
    });
});

router.post('/:id', function(req,res) {
    const id= (req.url.split('/'))[1];
    if(req.body.response){
        queries.postPlantR(req.body.user, req.body.question, id, req.body.response)
        .then(res => {
            res.redirect(req.originalUrl);
        })
        .catch(err => {
            res.render('error', { message: err});
        });
    }
    else if(req.body.question){
        queries.postPlantQ(req.body.user, req.body.question, id)
        .then(res => {
            res.redirect(req.originalUrl);
        })
        .catch(err => {
            res.render('error', { message: err});
        });
    }
    else {}
    res.redirect(req.originalUrl);
    
})

module.exports = router;