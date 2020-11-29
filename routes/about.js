var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  const aboutUs = `is an application dedicated to making gardening accessible 
    to hobbyists and those looking to be self-sustaining alike. Especially with the prevalence
    of the COVID-19 pandemic, more and more people are looking to try new things and we want to
    provide those interested in gardening with space to learn and GROW! (I'm not sorry -Sam). 
    Additionally, there are many environmental benefits to grow your own food and we want to 
    facilitate that as much as possible. 
    `;
  const samAbout = `
    4th-Year Computer Science undergrad student at Portland State University. Although I haven't
    done much gardening while in college, it was a family past-time while growing up to plant in our
    backyard. 
    `;
  const alexAbout = `
    2nd-year Computer Science masters student at Oregon Health & Science University. I love vegetables and
    have started gardening in the last few years. It's so easy to grow food in Oregon, but harder in
    other USDA zones. I would love more people to have access to information about how to grow food in their area. 
    `;
  res.render("about", {
    AboutUs: aboutUs,
    SamAbout: samAbout,
    AlexAbout: alexAbout,
  });
});

module.exports = router;
