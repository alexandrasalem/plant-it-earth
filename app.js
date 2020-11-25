var express = require("express");
var createError = require("http-errors");
const http = require("http");
const port = process.env.PORT || 5000;
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var path = require("path");
const bodyParser= require('body-parser');
const app = express();

//collecting routers
var indexRouter = require("./routes/index");
var plantRouter = require("./routes/plant");
var searchRouter = require("./routes/search");
var gettingStartedRouter = require("./routes/gettingstarted");
var aboutRouter = require("./routes/about");

//misc...
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true })); 

//views
express.static(__dirname, []);
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//routing
app.use("/", indexRouter);
app.use("/plant/", plantRouter);
app.use("/search/", searchRouter);
app.use("/gettingstarted/", gettingStartedRouter);
app.use("/about/", aboutRouter);

//start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
