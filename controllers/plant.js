const fetch= require("node-fetch");
var db = require("../database");
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
        FROM users u1, users u2, questions q, responses r, plants p
        WHERE
            p.plant_id=${plantid}
            AND q.plant_id=p.plant_id
            AND q.user_id=u1.user_id
            AND r.question_id= q.question_id
            AND r.user_id=u2.user_id 
    `);
    // console.log(result.rows);
    if(result.rows){
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
        // console.log(cleanedData);
        return cleanedData;
    }
    else{
        return null;
    }
}

//QUERY DRAFT
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

*/


exports.getPlantQA= getPlantQA;
exports.getTrefle= getTrefle;