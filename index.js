const express = require("express");
const request = require('request');
const _ = require('lodash');
const Client = require("@googlemaps/google-maps-services-js").Client;
const port = 8080;
const app = express();

app.use(express.static("public"));

var api_key = process.env.map;
var zip = 94131;
var lat = 37.7749;
var lon = -122.4194;
/*

It must use "partials"
It must use Express
It must use EJS or Handlebars or any templating package
It must use another npm package useful to the project, of your choosing.
For instance, you could use the faker package to display random fake data.

*/

//routes
app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/black", function(req, res){
    res.render("black.ejs");
});

app.get("/green", function(req, res){
    res.render("green.ejs");
});

app.get("/oolong", function(req, res){
    res.render("oolong.ejs");
});

app.get("/white", function(req, res){
    res.render("white.ejs");
});

app.get("/results", async function(req, res){
    zip = req.query.zipcode
    console.log(zip);
    await getLatLong();
    let nearby = await getPlaces();
    if(nearby && nearby.results.length){
        var result = _.sample(nearby.results);
        console.log(result);
        if(result.hasOwnProperty('opening_hours')){
            var open = result.opening_hours.open_now ? "Yes" : "No";
        } else {
            var open = "No";
        }
        let photo = getPhoto(result.photos[0].photo_reference);
        res.render("results.ejs", {"result":result, "open":open, "pic":photo});
    } else {
        res.render("error.ejs");
    }
});

function getLatLong(){
    return new Promise(function(resolve, reject) {
        let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+zip+'&key='+api_key;
        request(url, function(error, response, body){
            if (!error && response.statusCode == 200){
                let data =JSON.parse(body);
                lat = data.results[0].geometry.location.lat;
                lon = data.results[0].geometry.location.lng;
                resolve(data);
            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }
        });//request
    });//promise
}//function

function getPlaces(){
    return new Promise(function(resolve, reject) {
        let url = ' https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&radius=10000&keyword=tea&key='+api_key;
        request(url, function(error, response, body){
            if (!error && response.statusCode == 200){
                let data =JSON.parse(body);
                resolve(data);
            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }
        });//request      
    });//promise
}//function

function getPhoto(photo_ref){
    //return new Promise(function(resolve, reject){
        let url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photo_ref+'&key='+api_key;
        console.log(url);
        return url;
        // request(url, function(error, response, body){
        //     if (!error && response.statusCode == 200){
        //         //console.log(body.req.path)
        //         console.log(body);
        //         resolve(body);
        //     } else {
        //         reject(error);
        //         console.log(response.statusCode);
        //         console.log(error);
        //     }
        // });//request
    //});//promise  
}//function


//server listen
app.listen(process.env.PORT || port, function(){
    console.log("Express server is running...");
});


