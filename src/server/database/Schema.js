let mongoose = require("mongoose");

exports.User = mongoose.model("User", require("./UserSchema.js"));
exports.LiveSell = mongoose.model("LiveSell", require("./LiveSellSchema.js"));
