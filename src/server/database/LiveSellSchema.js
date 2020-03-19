let mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let LiveSellSchema = new Schema({
  username: String,
  category: String,
  description: String,
  email: String,
  items: [],
  source: { frontendPath: String, filetype: String },
  messages: [],
  state: String
});

module.exports = LiveSellSchema;
