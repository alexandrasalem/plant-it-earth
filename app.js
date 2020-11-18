var express = require('express');
const http = require('http'); 
const port = process.env.PORT || 5000;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
const app = express();

app.use(logger('dev'));

express.static(__dirname, [])
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/search', (req,res) => {
    res.sendFile(path.join(__dirname + '/views/search.html'))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});