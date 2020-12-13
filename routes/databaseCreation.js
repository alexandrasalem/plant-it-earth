const https = require('https');
var db = require("../database");




function setDB() {
    //create table PLANTS for storing basci data on plants
    db.query(
      "CREATE TABLE plants \
        ( id SERIAL PRIMARY KEY, \
          plant_id INT, \
          common_name VARCHAR(500), \
          scientific_name VARCHAR(500), \
          vegetable VARCHAR(500), \
          edible VARCHAR(500), \
          edible_part VARCHAR(500), \
          min_temp_f INT, \
          max_temp_f INT, \
          days_to_harvest INT, \
          min_zone VARCHAR(500));", (err, results) => {
        if (err) {
          console.error(err);              
        } 
    });

    // create table USERS for storing user data
    db.query("CREATE TABLE users \
            ( user_id SERIAL PRIMARY KEY, \
              username VARCHAR(100));", (err, results) => {
      if (err) {
        console.error(err);    
        } 
    });

    //create table USDA_ZONES for storing zipcode and usda planting zone association 
    db.query("CREATE TABLE usda_zones \
              ( zipcode INT, \
                zone VARCHAR(10));", (err, results) => {
      if (err) {
        console.error(err);    
        } 
    });

    //create ENUM Type for general question attribute that only allows 'yes' or 'no'  
    db.query("CREATE TYPE yes_no AS ENUM ('yes', 'no');", (err, results) => {
      if (err) {
        console.error(err);    
        } 
    });

    //create table QUESTIONS for storing questions about plants for Q&A forum  
    db.query("CREATE TABLE questions \
            ( question_id SERIAL PRIMARY KEY, \
              user_id INT REFERENCES user_id (users), \
              question_text VARCHAR(500), \
              general yes_no, \
              plant_id INT REFERENCES plant_id (plants), \
              timestamp_question TIMESTAMP );", (err, results) => {
      if (err) {
        console.error(err);    
        } 
    });

    //create table RESPONSES for storing responses to Q&A forum questions 
    db.query("CREATE TABLE responses \
            ( response_id SERIAL PRIMARY KEY, \
              question_id INT REFERENCES question_id (questions), \
              user_id INT REFERENCES user_id (users), \
              response_text VARCHAR(1000), \
              timestamp_response TIMESTAMP );", (err, results) => {
      if (err) {
        console.error(err);    
        } 
    });

     //create table USDA_ZONE_IDS for storing values for usda_zones 
     db.query("CREATE TABLE usda_zone_ids \
              ( id SERIAL PRIMARY KEY, \
                usda_zone_name VARCHAR(50));", (err, results) => {
      if (err) {
        console.error(err);    
        } 
    });

}

setDB();