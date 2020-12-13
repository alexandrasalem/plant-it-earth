const https = require('https');
var db = require("../database");


function importToDB() {
    //import values for usda_zones numerical values
    db.query("INSERT INTO usda_zone_ids (usda_zone_name) \
              VALUES \
                ('0a'), \
                ('0b'), \
                ('1a'), \
                ('1b'), \
                ('2a'), \
                ('2b'), \
                ('3a'), \
                ('3b'), \
                ('4a'), \
                ('4b'), \
                ('5a'), \
                ('5b'), \
                ('6a'), \
                ('6b'), \
                ('7a'), \
                ('7b'), \
                ('8a'), \
                ('8b'), \
                ('9a'), \
                ('9b'), \
                ('10a'), \
                ('10b'), \
                ('11a'), \
                ('11b'), \
                ('12a'), \
                ('12b');", (err, results) => {
        if (err) {
          console.error(err);              
        } 
    });
}

function seedDB() {
  //seed data for Q&A portion of the app for the demo 
  //data for questions
  db.query("INSERT INTO questions (user_id, question_text, general, plant_id, timestamp_question)\
            VALUES\
                (3, 'is it sweet if grown indoor only?', 'no', 193519, now()),\
                (2, 'How sweet is it?', 'no', 166402, now()),\
                (3, 'Is is hard to harvest in zone 8a?', 'no', 125316, now()),\
                (16, 'Can it grow in zone 3a?', 'no', 189539, now()),\
                (20, 'Are those Ok for salads?', 'no', 147167, now()),\
                (3, 'Can I eat with my salad or is it too sweet?', 'no', 166402, now()),\
                (2, 'How many plants I need for 2-3 people?', 'no', 125316, now()),\
                (16, 'What insects I should be worries about?', 'no', 125316, now()),\
                (20, 'Is it tiny?', 'no', 166402, now()), \
                (3, 'How different this kind form butter lettuce?', 'no', 147167, now());", (err, results) => {
      if (err) {
        console.error(err);              
      } 
  });
  //data for responses
  db.query("INSERT INTO responses (question_id, user_id, response_text, timestamp_response)\
            VALUES\
                (39, 16, 'I tried it and it was mildly sweet', now()),\
                (39, 20, 'Yes, it is.', now()),\
                (41, 20, 'No, it is very easy', now()),\
                (42, 3, 'Probably not, too cold', now()),\
                (43, 1, 'Yes, they are very tasty?', now()),\
                (44, 1, 'You should try and let us know', now()),\
                (45, 3,  'I would start with just one they are very fruitful', now()),\
                (46, 20,  'It all depend on where you live. They are highly liked by insects because of their watery leafs.', now()),\
                (47, 16, 'Not really, but they could come small if grown indoor', now()),\
                (41, 2, 'I do it all the time', now());", (err, results) => {
      if (err) {
        console.error(err);              
      } 
  });

}

importToDB();
seedDB();