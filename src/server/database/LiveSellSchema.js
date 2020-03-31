let mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let LiveSellSchema = new Schema({
  username: String,
  category: String,
  description: String,
  email: String,
  items: [],
  source: { frontendPath: String, filetype: String },
  thumbnail: { frontendPath: String, filetype: String },
  poster: { frontendPath: String, filetype: String },
  messages: [],
  state: String,
  stream_key: String
});

module.exports = LiveSellSchema;
