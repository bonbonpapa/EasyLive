const express = require("express"),
  LiveSell = require("../database/Schema.js").LiveSell,
  multer = require("multer"),
  router = express.Router(),
  InitDb = require("../db.js").initDb,
  getDb = require("../db.js").getDb;

let upload = multer({
  dest: __dirname + "/../uploads/"
});
let dbo = undefined;

InitDb(function(err) {
  if (err) {
    console.log("Error with the Mongodb database initializaion error ", err);
    return;
  }
  dbo = getDb();
});

router.get("/", (req, res) => {
  // get the requested live sell information based on the _id live from frontend
  if (req.query.liveid) {
    LiveSell.findOne(
      {
        _id: req.query.liveid
      },
      (err, sell) => {
        if (err) return;
        if (sell) {
          console.log("Find the sell information from server", sell);
          res.json({
            livesell: sell
          });
        }
      }
    );
  } else {
    res.json({});
  }
});

router.get("/completed", (req, res) => {
  console.log("request to /all-items");
  LiveSell.find({ state: "completed" }, (err, sells) => {
    if (err) {
      console.log("error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    // console.log("Completed Live Sells", sells);
    res.send(JSON.stringify({ success: true, sells: sells }));
  });
});

router.post("/livecreator", upload.none(), async (req, res) => {
  // here to get the body about the formdata inforamtion from the request
  // and then create the livesell using the information provided by the user
  console.log("Server in the LiveCreator endpoint, ", req.body);

  const description = req.body.description;
  const category = req.body.category;
  const email = req.body.email;
  const username = req.body.username;
  const stream_key = req.body.stream_key;

  console.log("informatoon in the description: ", description);
  console.log("Inforamtion email: ", email);
  console.log("Information category ", category);

  let liveitems = await dbo
    .collection("items")
    .find({})
    .toArray();

  let LiveSelling = new LiveSell();
  LiveSelling.username = username;
  LiveSelling.stream_key = stream_key;
  LiveSelling.description = description;
  LiveSelling.category = category;
  LiveSelling.email = email;
  LiveSelling.items = liveitems.slice();
  LiveSelling.state = "active";

  LiveSelling.save((err, sell) => {
    if (err) res.send(JSON.stringify({ success: false, error: err }));
    res.send(JSON.stringify({ success: true, livesell: sell }));
  });
});

router.post("/livesave", upload.single("videofile"), async (req, res) => {
  console.log("req to save live, ", req.body);

  let liveid = req.body.liveid;
  console.log("id for the live sell, ", liveid);

  let file = req.file;
  console.log("file selected by the server", file);
  let frontendPath = {
    frontendPath: "/uploads/" + file.filename,
    filetype: "application/x-mpegURL"
  };
  console.log("video file location, ", frontendPath);
  let messages = [{ name: "admin", message: "new user connection" }];

  let newLiveSell = null;

  try {
    newLiveSell = await LiveSell.findOneAndUpdate(
      { _id: liveid },
      {
        $set: { source: frontendPath, messages: messages, state: "completed" }
      },
      { new: true }
    );
  } catch (err) {
    console.log("error when update the existed livesell, ", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
  if (newLiveSell) {
    console.log(
      "Return from update the live sell with video source and messages,",
      newLiveSell
    );
    res.send(JSON.stringify({ success: true, livesell: newLiveSell }));
    return;
  }
});

module.exports = router;
