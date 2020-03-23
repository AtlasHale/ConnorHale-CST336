const express = require("express");
const port = 8080;
const app = express();
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));

//routes
app.get("/", function(req, res){
    res.render("index.html");
});

app.get("/mercury", function(req, res){
    res.render("mercury.html");
});

app.get("/venus", function(req, res){
    res.render("venus.html");
});

app.get("/earth", function(req, res){
    res.render("earth.html");
});

app.get("/mars", function(req, res){
    res.render("mars.html");
});


//server listen
app.listen(process.env.PORT || port, function(){
    console.log("Express server is running...");
});