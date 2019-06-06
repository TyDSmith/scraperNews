var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cryptoNewsSchema = new Schema({
  articleTitle: {
    type: String,
    trim: true,
    required: "NHL Post Header is Required"
  },
  urlLink: {
    type: String
  },
  articleImage: {
    type: String
  }
});

var cryptoNewsModel = mongoose.model("news_scraper_collections", cryptoNewsSchema);
module.exports = cryptoNewsModel