var axios = require("axios");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var express = require("express");
var app = express();
var exphbs = require("express-handlebars");
var db = mongojs("ty_db", ['news_scraper_collections']); 

var PORT = 8082;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


axios.get("https://blokt.com/headlines/cryptocurrency").then(function(response) {
    var $ = cheerio.load(response.data);
    $("div.td_module_2").each(function(i, element){
        var header =  $(element).find("h3.td-module-title").text();
        console.log(header);
        var link = $(element).find("h3.entry-title.td-module-title a").attr("href");
        console.log(link);
        var image = $(element).find(".td-module-image > .td-module-thumb img").attr("data-img-url");
        console.log(image);
        db.news_scraper_collections.insert(
            {
                "header" : header,
                "link" : link,
                "image" : image
            }
        );
    })
});

app.get("/", function (req, res){
    res.render("index");
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});