const MongoDb = require("mongodb");
const MongoClient = MongoDb.MongoClient;
const config = require("./config/default.js");

let _db = undefined;
let url = config.mongodb_url.url;
module.exports = {
  getDb,
  initDb
};

function initDb(callback) {
  if (_db) {
    console.log("Try to init DB again!");
    return callback(null, _db);
  }
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      return callback(err);
    }
    _db = client.db("media-board");
    return callback(null, _db);
  });
}
function getDb() {
  if (_db === undefined) {
    console.log("DB has not been initialzied, please call init first");
    return;
  }
  return _db;
}
