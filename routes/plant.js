var express = require('express');
var router = express.Router();
var path = require('path');
const { fileURLToPath } = require('url');
const url = require('url'); 
const {token}= require('../credentials');
const queries= require("../controllers/plant");

// //for dev: 
// const testQA= [
//     {
//         user: "tomatoFan",
//         question: "Why tomatoes?",
//         responses: [
//             {
//                 user: "tomatoFan",
//                 response: "bc I love them",
//             },
//             {
//                 user: "someoneElse",
//                 response: "I hate tomatoes!",
//             },
//             {
//                 user: "tomatoFan",
//                 response: "that's a disgrace...",
//             }
//         ]
//     },
//     {
//         user: "someoneElse",
//         question: "Why NOT tomatoes?",
//         responses: [
//             {
//                 user: "tomatoFan",
//                 response: "you're wrong!",
//             },
//             {
//                 user: "someoneElse",
//                 response: "no",
//             },
//             {
//                 user: "reasonableUser",
//                 response: "you guys are taking this too seriously",
//             }
//         ]
//     }
// ];

router.get('/', function (req,res) {
    res.status(320);
    res.redirect('/'); //returns to the home url
});

router.get('/:id', function (req,res) {
    console.log("is this happening?")
    let id= (req.url.split('/'))[1];
    const trefleQuery= 'https://trefle.io/api/v1/plants/'+id+`/?token=${token}`;

    Promise.all([queries.getTrefle(trefleQuery),queries.getPlantQA(id)])
    .then(([trefleResult, dbResult]) => {
        // console.log(dbResult);
        res.render('plant', {result:trefleResult, qa: dbResult});
    });
});

router.post('/:id', function(req,res) {
    console.log("is this happening?")
    if(req.body.response){
        console.log(req.body);
    }
    else if(req.body.question){
    }
    else {}
    res.redirect(req.originalUrl);
    
})

module.exports = router;

//query brainstorming
/*
select question, question_id 
from questions
where id= x; where x is the value of the plant id

select response 
from responses r, res_ques_rel rel
where r.id= rel.res_id and rel.q_id= question_id <- passed in value retreived from previous query

combine these?
*/


//VERBAL DESIGN:
//**GET
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
//Responses:
//  add entry to response table
//  Find id of question (how?) and relate to id of response
