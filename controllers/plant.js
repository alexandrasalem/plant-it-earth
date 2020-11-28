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
            let desiredProperty= desiredSections.indexOf(property);

            if(desiredProperty === -1) continue;
            let propName= property.replace(/\_/, " ");
            propName= propName.replace(/(?<=\s|^)([a-zA-Z"])/, function(char){return char.toUpperCase();})
            cleanedData[`${propName}`]= data.data[`${property}`];
        }
        return cleanedData;
    };
}

//GET responses, questions, and users associated with a specific plant 
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
    return cleanedData;
}

//POST questions implementation
async function postPlantQ(username, question, plantName, plant_id) {
    //check if there is a user_id associated with that username
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
    
    // check if there is a plant associated with that plant_id
    let plantCheck= await db.query(`
        SELECT * 
        FROM plants
        WHERE plant_id=${plant_id}
    `);
    if(!plantCheck.rows[0]){
        let cleanedName= plantName.replace(/'/, "\\\\'\'");
        console.log(cleanedName);
        db.query(`
            INSERT INTO plants (plant_id, name)
            VALUES (${plant_id}, '${cleanedName}')
        `);
    }
    let postResult= await db.query(`
        INSERT INTO questions (user_id, question_text, general, plant_id, timestamp_question)
        VALUES (${user_id}, '${question}', 'no', ${plant_id}, NOW()) 
    `);
    return postResult;

}

//POST response implementation
async function postPlantR(username, question, plant_id, response){
    let user_id= await db.query(`
        SELECT user_id
        From users
        WHERE username='${username}'
    `)
    if(!user_id.rows[0])
        user_id= await db.query(`
        INSERT INTO users (username)
        VALUES ('${username}')
        RETURNING user_id
        `);

    user_id= user_id.rows[0].user_id;

    let question_id= await db.query(`
        SELECT question_id
        FROM questions, plants
        WHERE question_text='${question}'
        AND questions.plant_id=${plant_id}
    `);
    question_id= question_id.rows[0].question_id;
  
    let postResults= db.query(`
        INSERT INTO responses (question_id, user_id, response_text, timestamp_response)
        VALUES ('${question_id}', '${user_id}', '${response}', NOW())
    `);
    return postResults;
}

//wipes a user and all their associated questions/responses, mainly intended for testing but could be used in the future 
async function wipeUser(username){
    //get userid and associated questions
    let user_id= await db.query(`
        SELECT user_id
        FROM users
        WHERE username= '${username}'
    `);

    if(!user_id.rows[0]) return;
    user_id= user_id.rows[0].user_id;
    

    let question_ids= await db.query(`
        SELECT question_id
        FROM questions q 
        where q.user_id=${user_id}
    `);

    if(question_ids.rows.length){
        //build list of question ids
        let cleanedQuestionIds= [];
        for(let i= 0; i < question_ids.rows.length; ++i){
            cleanedQuestionIds.push(question_ids.rows[i].question_id);
        }

        // delete responses associated with user_id and quesiton ids
        let result= await db.query(`
            DELETE 
            FROM responses r
            WHERE r.user_id=${user_id}
            OR r.question_id IN (${cleanedQuestionIds})
            RETURNING r.response_id;
        `);
    }

    //delete questions and responses associated with that question
    let result= await db.query(`
        DELETE 
        FROM questions q
        WHERE q.user_id=${user_id}
    `);
     
    // remove user
    result= await db.query(`
        DELETE 
        FROM users
        WHERE user_id=${user_id}
    `);
}

exports.wipeUser= wipeUser;
exports.postPlantQ= postPlantQ;
exports.postPlantR= postPlantR;
exports.getPlantQA= getPlantQA;
exports.getTrefle= getTrefle;