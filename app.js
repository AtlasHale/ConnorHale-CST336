const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
var alignment = "horizontal";
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

const request = require('request');

//routes
app.get("/", async function(req, res){
    let homeImages = ["flowers", "desert", "mountain", "ocean", "space"];
    let randomIndex = Math.floor(Math.random() * 5);

    let parsedData = await getImages(homeImages[randomIndex], "horizontal");
    let randomImg1 = Math.floor(Math.random() * parsedData.hits.length);
    let randomImg2 = (randomImg1+2)%parsedData.hits.length;
    let randomImg3 = (randomImg1+4)%parsedData.hits.length;
    let randomImg4 = (randomImg1+6)%parsedData.hits.length;

    console.dir("parsedData: " + parsedData); //displays content of the object
    res.render("index", {
        "image1":parsedData.hits[randomImg1].largeImageURL,
        "image2":parsedData.hits[randomImg2].largeImageURL,
        "image3":parsedData.hits[randomImg3].largeImageURL,
        "image4":parsedData.hits[randomImg4].largeImageURL
    });
            
}); //root route


app.get("/results", async function(req, res){
    
    //console.dir(req);
    let keyword = req.query.keyword; //gets the value that the user typed in the form using the GET method
    alignment = req.query.align;
    let parsedData = await getImages(keyword, alignment);
    let startIndex = Math.abs(Math.floor(Math.random() * parsedData.hits.length-8)%20);
    res.render("results", {"images":parsedData, "startIndex": startIndex, "key": keyword, "align": alignment});
    
});//results route


//Returns all data from the Pixabay API as JSON format
function getImages(keyword, alignment){
    return new Promise(function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword+'&orientation='+alignment,
                 function (error, response, body) {
            console.log('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword+'&orientation='+alignment);
            if (!error && response.statusCode == 200  ) { //no issues in the request
                
                 let parsedData = JSON.parse(body); //converts string to JSON
                 resolve(parsedData);

            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }
    
        });//request
    });
}


//starting server
app.listen(process.env.PORT || port, function(){
    console.log("Express server is running...");
});