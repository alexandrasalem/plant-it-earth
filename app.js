var express = require("express");
var createError = require("http-errors");
const http = require("http");
const port = process.env.PORT || 5000;
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var path = require("path");
const app = express();

//collecting routers
var indexRouter = require("./routes/index");
var plantRouter = require("./routes/plant");
var searchRouter = require("./routes/search");

//misc...
app.use(logger("dev"));

//views
express.static(__dirname, [])
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));     //these are for when pug is put together
app.set('view engine', 'pug');

//routing
app.use("/", indexRouter);
app.use("/plant/", plantRouter);
app.use("/search/", searchRouter);

//start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
