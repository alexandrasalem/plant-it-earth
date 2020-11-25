const fetch= require("node-fetch");
var db = require("../database");

//utils
const desiredSections= ["common_name", "year", "bibliography", "sources", "scientific_name", "image_url"];

//Query trefle based on a provide query URL
async function getTrefle(trefleQuery) {
    let res= await fetch(trefleQuery);
    let data= await res.json();
    if(data.error){
        return data.error
    }
    else{
        cleanedData= {};
        for(property in data.data){
            if(!data.data[property]) continue;
            // console.log(property);
            let desiredProperty= desiredSections.indexOf(property);

            if(desiredProperty === -1) continue;
            let propName= property.replace(/\_/, " ");
            propName= propName.replace(/(?<=\s|^)([a-zA-Z"])/, function(char){return char.toUpperCase();})
            cleanedData[`${propName}`]= data.data[`${property}`];
        }
        return cleanedData;
        // console.log(cleanedData);
        // res.render('plant', {result: cleanedData});
    };
}

//query the database for questions, responses, and users based on a plant id!
async function getPlantQA(plantid){
    let result = await db.query(`
    SELECT u1.username, question_text, response_text, u2.username as r_username
        FROM users u1
        JOIN questions q
        ON q.user_id=u1.user_id
        LEFT JOIN responses r
        ON r.question_id= q.question_id
        LEFT JOIn users u2
        ON r.user_id = u2.user_id
        JOIN plants p
        ON p.plant_id = q.plant_id
    WHERE
        p.plant_id=${plantid}
    `);
    // console.log(result.rows);
    if(!result.rows) return null;

    let cleanedData= [];
    let questionStash= []; //used to check if a question already exists for this row
    for(let i= 0; i < result.rows.length; ++i){
        const queryRow= result.rows[i];
        let questionExists= questionStash.indexOf(queryRow.question_text);
        if(questionExists === -1){
            questionStash.push(queryRow.question_text)
            let newQuestion= {};
            newQuestion.question= queryRow.question_text;
            newQuestion.user= queryRow.username;
            cleanedData.push(newQuestion);
        }
        if(queryRow.response_text){
            let newResponse= {};
            newResponse.response= queryRow.response_text;
            newResponse.user= queryRow.r_username;    
            // console.log(newResponse);
            for(let i= 0; i < cleanedData.length; ++i){
                let QA= cleanedData[i];
                if(QA.question == queryRow.question_text){
                    if(!QA.responses)
                        QA.responses= [];
                    QA.responses.push(newResponse);
                    break;  //oof
                }
            }
        }
    }
    // console.log(cleanedData);
    return cleanedData;
}

async function postPlantQ(username, question, plant_id) {
    //this could use some cleaning, what if character cases are off?
    let result= await db.query(`
        SELECT user_id
        FROM users
        WHERE username='${username}'
    `)
    if(!result.rows[0])
        result= await db.query(`
        INSERT INTO users (username)
        VALUES ('${username}')
        RETURNING user_id
        `);
    const user_id= result.rows[0].user_id;
    // console.log(user_id,question, id);
    let postResult= await db.query(`
        INSERT INTO questions (user_id, question_text, general, plant_id, timestamp_question)
        VALUES (${user_id}, '${question}', 'no', ${plant_id}, NOW()) 
    `);
    // console.log(postResult);
    return postResult;

}

async function postPlantR(){

}

//GET QUERY DRAFT
/*
    SELECT u1.username, question_text, response_text, u2.username as r_username
    FROM users u1, users u2, questions q, responses r, plants p
    WHERE
        p.plant_id=182512
        AND q.plant_id=p.plant_id
        AND q.user_id=u1.user_id
        AND r.question_id= q.question_id
        AND r.user_id=u2.user_id 
    ;

    //Testing - this gets all the questions and their users for a specific plant
    select username, question_text 
    from users u, questions q, plants p,
    where
    p.plant_id=182512 
    AND q.plant_id=p.plant_id
    AND q.user_id=u.user_id;

    //Testing - this gets all the responses and their users and questions for a specific plant
    select username, question_text, response_text 
    from users u, questions q, plants p,responses r
    where
    p.plant_id=182512 
    AND q.plant_id=p.plant_id
    AND q.user_id=u.user_id
    AND r.question_id=q.question_id;
*/

//POST QUERY DRAFT (Q)
/*
    //check if this user exists!
    select user_id from users where username=`${someName}
            if not:
                INSERT INTO users (username) VALUES ${someName} 
                    RETURNING user_id
    INSERT INTO questions (user_id, question_text, plant_id, timestamp_response)
    VALUES (${userId}, ${question_text}, now());
*/

//POST QUERY DRAFT (R)
/*
    INSERT INTO responses (question_id, user_id, response_text, timestamp_response)
postgres-> VALUES (1, 3, ‘I have done it without issues...’, now());
*/

exports.postPlantQ= postPlantQ;
exports.postPlantR= postPlantR;
exports.getPlantQA= getPlantQA;
exports.getTrefle= getTrefle;