var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    const aboutUs= `is an application dedicated to making gardening accessible 
    to hobbyists and those looking to be self-sustaining alike. With the prevalence
    of the COVID-19 pandemic, more and more people are looking to try new things and we want to
    provide those interested in gardening with space to learn and GROW! (I'm not sorry -Sam). 
    Additionally, there are many environmental benefits to growing your own food and we want to 
    facilitate that as much as possible. 
    `;
    const samAbout= `
    4th-Year Computer Science undergrad student at Portland State University. Although I haven't
    done much gardening while in college, it was a family past-time while growing up to plant in our
    backyard. 
    `;
    res.render('about', {AboutUs: aboutUs, SamAbout: samAbout});
})

module.exports= router;