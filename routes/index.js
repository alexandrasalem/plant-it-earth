var express = require('express');
var router = express.Router();
var path = require('path');
// https://trefle.io/api/v1/plants?token=YOUR_TREFLE_TOKEN&filter[common_name]=beach%20strawberry

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

router.get('/test', (req,res) => {
    res.status(200)
    res.write("this is working this is WOOOOOOOORKIIIIIIIIIINGG");
    res.send();
})

module.exports = router;