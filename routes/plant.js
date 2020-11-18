var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function (req,res) {
    res.redirect()
});

router.get('/:id', function (req,res) {
    res.status(200);
    res.write("plant...");
    res.send();
})

module.exports = router;