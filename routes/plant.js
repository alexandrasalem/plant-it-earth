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
        // console.log(dbResult);
        res.render('plant', {result:trefleResult, qa: dbResult});
    });
});

router.post('/:id', function(req,res) {
    if(req.body.response){  //could maybe add a query here to verify that the question exists, i don't think that can happen... but ya know... code lines 
        console.log(req.body);
    }
    else if(req.body.question){
        // console.log(req.body);
        let id= (req.url.split('/'))[1];
        console.log(queries.postPlantQ(req.body.user, req.body.question, id));
    }
    else {}
    res.redirect(req.originalUrl);
    
})

module.exports = router;

//VERBAL DESIGN:
//**GET -- DONE
//Check database for questions related to a plant_id
// if yes:
//      Find all questions and corresponding responses 
//      AND USERS!
//      toJSON and then pass to pug
// if not: 
//      don't pass anything 

//**POST
//Questions:
//  Add a new field to questions (make sure to relate to user)
// if user doesn't exist...
//  add to user table

//Responses:
/*
add entry to response table
if user doesn't exist...
    Add to user table
//  Find id of question (query UGH) and add to response row
*/
