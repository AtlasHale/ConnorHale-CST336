const express = require("express");
const request = require('request');

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

//routes
app.get("/", function(req, res){
    res.render("home");
}); //root route


app.get("/results", function(req, res){
    var bibkey = req.query.search; //gets the value that the user typed in the form using the GET method
    let url = 'https://openlibrary.org/api/books?bibkeys=ISBN:'+bibkey+'&format=json&jscmd=data';
    request(url, function (error, response, body) {
        console.log(url);
        if (!error && response.statusCode == 200  ) { //no issues in the request
             let data = JSON.parse(body); //converts string to JSON
             res.render("results", {"data":data, "isbn": bibkey});
        } else {
            console.log(response.statusCode);
            console.log(error);
        }
    });
});


//starting server
app.listen(process.env.PORT || port, function(){
    console.log("Express server is running...");
});