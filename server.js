var axios = require("axios");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var express = require("express");
var app = express();
var exphbs = require("express-handlebars");
var cryptoNewsModel = require("./cryptoModel");
var PORT = 8082;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ty_db";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log ("we're connected!")
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public'));

axios.get("https://blokt.com/headlines/cryptocurrency").then(function(response) {
    var $ = cheerio.load(response.data);
    cryptoNewsModel.deleteMany({}).then(
    $("div.td_module_2").each(function(i, element){
        var articleTitle =  $(element).find("h3.td-module-title").text();
        var urlLink = $(element).find("h3.entry-title.td-module-title a").attr("href");
        var articleImage = $(element).find(".td-module-image > .td-module-thumb img").attr("data-img-url");
            cryptoNewsModel.create(
                {
                    "articleTitle" : articleTitle,
                    "urlLink" : urlLink,
                    "articleImage" : articleImage
                }
            );
    })
    )
});

app.get("/", function (req, res){
    cryptoNewsModel.find({  
    }).then(function(data){
        let hbsObject = {data: data};
        res.render("index", hbsObject);
    });
});

app.get("/data", function (req, res){
    cryptoNewsModel.find({

    }).then(function(data){
        res.send(data);
    });
    // mongoose.model('header').find(function(err,Header){
  
    // })
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
