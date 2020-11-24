var express = require('express');
var router = express.Router();
var path = require('path');
const { fileURLToPath } = require('url');
const url = require('url'); 
const fetch= require("node-fetch");
const token= require('../credentials');
const desiredSections= ["common_name", "year", "bibliography", "sources", "scientific_name", "image_url"];


router.get('/', function (req,res) {
    res.status(320);
    res.redirect('/'); //returns to the home url
});

router.get('/:id', function (req,res) {
    let id= (req.url.split('/'))[1];
    const trefleQuery= 'https://trefle.io/api/v1/plants/'+id+`/?token=${token.token}`;
    
    fetch(trefleQuery)
    .then(res => res.json())
    .then((data)=> {
        if(data.error){
            res.render('error', {message: data.message});
        }
        else{
            cleanedData= {};
            for(property in data.data){
                if(!data.data[property]) continue;
                console.log(property);
                let desiredProperty= desiredSections.indexOf(property);

                if(desiredProperty === -1) continue;
                let propName= property.replace(/\_/, " ");
                propName= propName.replace(/(?<=\s|^)([a-zA-Z"])/, function(char){return char.toUpperCase();})
                cleanedData[`${propName}`]= data.data[`${property}`];
            }
            console.log(cleanedData);
            res.render('plant', {result: cleanedData});
        }
    });
});

module.exports = router;

/*
each section in sections
              if propName == section && result[propName]
                strong #{propName}
                
*/