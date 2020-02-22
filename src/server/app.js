const express = require("express"),
  config = require("./config/default.js"),
  port = 4000,
  shortid = require("shortid"),
  app = express(),
  MongoDb = require("mongodb"),
  MongoClient = MongoDb.MongoClient,
  ObjectID = MongoDb.ObjectID,
  thumbnail_generator = require("./cron/thumbnails.js");

let dbo = undefined;
let url = config.mongodb_url.url;
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  dbo = client.db("media-board");
});

let stream_key = "";
// Add this on the top of app.js file
// next to all imports
const node_media_server = require("./media_server.js");

// and call run() method at the end
// file where we start our web server

app.use("/", express.static("public"));
app.use("/uploads", express.static("uploads"));

app.get("/stream_key", (req, res) => {
  res.json({ stream_key: stream_key });
});
app.post("/stream_key", (req, res) => {
  stream_key = shortid.generate();
  res.json({ stream_key: stream_key });
});
app.get("/user", (req, res) => {
  let username = req.query.username;
  console.log("username of the streamung", username);

  res.json({
    stream_key: stream_key
  });
});
app.get("/info", (req, res) => {
  if (req.query.streams) {
    let streams = JSON.parse(req.query.streams);
    let query = { $or: [] };
    for (let stream in streams) {
      if (!streams.hasOwnProperty(stream)) continue;
      query.$or.push({ stream_key: stream });
    }

    res.json([{ username: "pi", stream_key: stream_key }]);

    // User.find(query, (err, users) => {
    //   if (err) return;
    //   if (users) {
    //     res.json(users);
    //   }
    // });
  }
});

app.get("/all-items", (req, res) => {
  console.log("request to /all-items");
  dbo
    .collection("items")
    .find({})
    .toArray((err, items) => {
      if (err) {
        console.log("error", err);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      // console.log("Items", items);
      res.send(JSON.stringify({ success: true, items: items }));
    });
});

app.get("/test", (req, res) => {
  console.log("in Server test endpoint");
  res.send(JSON.stringify({ success: true }));
});

app.listen(port, () => console.log(`Server app is listening on ${port}!`));

node_media_server.run();
thumbnail_generator.start();
