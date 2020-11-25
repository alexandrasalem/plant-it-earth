var express = require("express");
var router = express.Router();
var path = require("path");

var db = require("../database");

router.get("/pg", (req, res) => {

  db.query('SELECT NOW() as now', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  });

});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
    const aboutUs= `is an application dedicated to making gardening accessible 
    to hobbyists and those looking to be self-sustaining alike. Especially with the prevalence
    of the COVID-19 pandemic, more and more people are looking to try new things and we want to
    provide those interested in gardening with space to learn and GROW! (I'm not sorry -Sam). 
    Additionally, there are many environmental benefits to grow your own food and we want to 
    facilitate that as much as possible. 
    `;
    const samAbout= `
    4th-Year Computer Science undergrad student at Portland State University. Although I haven't
    done much gardening while in college, it was a family past-time while growing up to plant in our
    backyard. 
    `;
    res.render('about', {AboutUs: aboutUs, SamAbout: samAbout});
})

router.get("/test", (req, res) => {
  res.status(200);
  res.write("this is working this is WOOOOOOOORKIIIIIIIIIINGG");
  res.send();
});

module.exports = router;
