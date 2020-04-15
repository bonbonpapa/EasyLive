const express = require("express"),
  LiveSell = require("../database/Schema.js").LiveSell,
  mongoose = require("mongoose"),
  multer = require("multer"),
  router = express.Router(),
  config = require("../config/default.js"),
  InitDb = require("../db.js").initDb,
  getDb = require("../db.js").getDb,
  fs = require("fs"),
  util = require("util"),
  mkdirp = require("mkdirp"),
  { getMsgRoom, removeMsgRoom } = require("../users.js");

let upload = multer({
  dest: __dirname + "/../uploads/",
});
let dbo = undefined;

InitDb(function (err) {
  if (err) {
    console.log("Error with the Mongodb database initializaion error ", err);
    return;
  }
  dbo = getDb();
});

let create = async (sellObj) => {
  let new_live = null;

  try {
    new_live = await LiveSell.findOneAndUpdate(
      { email: sellObj.email, state: "active" },
      {
        $setOnInsert: sellObj,
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.log("Error, ", err);
    //   res.send(JSON.stringify({ success: false, error: err }));
    return null;
  }
  if (new_live) {
    console.log(
      "results afer updating the stream live, and if not existed, crrated the stream for the user",
      new_live
    );
    //  res.send(JSON.stringify({ success: true, livesell: new_live }));
    return new_live;
  }
  //res.send(JSON.stringify({ success: false }));
  return null;
};

router.get("/", (req, res) => {
  // get the requested live sell information based on the _id live from frontend
  if (req.query.liveid) {
    LiveSell.findOne(
      {
        _id: req.query.liveid,
      },
      (err, sell) => {
        if (err) return;
        if (sell) {
          //    console.log("Find the sell information from server", sell);
          res.json({
            livesell: sell,
          });
        }
      }
    );
  } else {
    res.json({});
  }
});

router.get("/delete", async (req, res) => {
  const pid = req.query.pid;
  console.log("delete item in the cart, prduct id: ", pid);
  let user = req.user;
  // console.log("User information in the delete items endpoint, ", user);

  if (req.user) {
    try {
      newSell = await LiveSell.findOneAndUpdate(
        { email: user.email, state: "active" },
        { $pull: { items: { _id: mongoose.Types.ObjectId(pid) } } },
        { new: true }
      );
    } catch (err) {
      console.log("Error with delete item from Cart", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (newSell) {
      // console.log("New cart updated ", newSell);
      res.send(JSON.stringify({ success: true, livesell: newSell }));
      return;
    }
  }
  res.send(JSON.stringify({ success: false }));
});

router.get("/completed", (req, res) => {
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
router.get("/doneinfo", (req, res) => {
  let stream_key = req.query.stream;
  console.log("In the server endpoint to get the video files list", stream_key);
  let ouPath = `${config.rtmp_server.http.mediaroot}/${config.rtmp_server.trans.tasks[0].app}/${stream_key}`;
  let newPath = `${config.rtmp_server.http.mediaroot}/${config.rtmp_server.trans.tasks[0].archive}/${stream_key}`;
  console.log("Video folder ", ouPath);
  let oufiles = [];
  fs.readdir(ouPath, function (err, files) {
    if (!err) {
      files.forEach((filename) => {
        if (filename.endsWith(".mp4")) {
          //      console.log(filename);
          //  oufiles.push(ouPath + "/" + filename);
          oufiles.push(filename);
        }
      });

      // if (!fs.existsSync(newPath)) {
      //   fs.mkdirSync(newPath);
      // }
      const made = mkdirp.sync(newPath);
      console.log("dir created,", made);
      let oldPath = `${ouPath}/${oufiles[oufiles.length - 1]}`;
      let newP = `${newPath}/${oufiles[oufiles.length - 1]}`;
      fs.rename(oldPath, newP, (err) => {
        if (err) throw err;
        console.log("successfully remove the video to archive location", newP);
      });
      //  console.log(oufiles);
      res.send(JSON.stringify({ success: true, files: oufiles }));
    } else res.send(JSON.stringify({ success: false }));
  });
});

let donesave = async (stream_key) => {
  const rename = util.promisify(fs.rename);
  const readdir = util.promisify(fs.readdir);
  console.log("In the server endpoint to get the video files list", stream_key);
  let ouPath = `${config.rtmp_server.http.mediaroot}/${config.rtmp_server.trans.tasks[0].app}/${stream_key}`;
  let newPath = `${config.rtmp_server.http.mediaroot}/${config.rtmp_server.trans.tasks[0].archive}/${stream_key}`;
  console.log("Video folder ", ouPath);
  let oufiles = [];
  let files;
  try {
    files = await readdir(ouPath);
  } catch (err) {
    console.log("error during read dir, ", err);
  }

  files.forEach((filename) => {
    if (filename.endsWith(".mp4")) {
      //      console.log(filename);
      //  oufiles.push(ouPath + "/" + filename);
      oufiles.push(filename);
    }
  });

  const made = mkdirp.sync(newPath);
  if (made) console.log("dir created,", made);
  else console.log("dir existed");

  let oldPath = `${ouPath}/${oufiles[oufiles.length - 1]}`;
  let newP = `${newPath}/${oufiles[oufiles.length - 1]}`;
  let videofile = oufiles[oufiles.length - 1];
  try {
    await rename(oldPath, newP);
  } catch (error) {
    console.log(error);
  }
  console.log("Video file move to the new locaiton,", newP);
  return videofile;
};

router.post("/livecreator", upload.array("mfiles", 9), async (req, res) => {
  // here to get the body about the formdata inforamtion from the request
  // and then create the livesell using the information provided by the user
  console.log("Server in the LiveCreator endpoint, ", req.body);

  let files = req.files;
  console.log("uploaded files", files);

  let frontendPaths = files.map((file) => {
    if (file) {
      let filetype = file.mimetype;
      return { frontendPath: "/uploads/" + file.filename, filetype: filetype };
    } else {
      return null;
    }
  });
  console.log("Frontend path array", frontendPaths);

  const description = req.body.description;
  const category = req.body.category;
  const email = req.body.email;
  const username = req.body.username;
  const stream_key = req.body.stream_key;
  let thumbnail = frontendPaths[0];
  let poster = frontendPaths[1];
  const items = JSON.parse(req.body.items);
  console.log("Items pass to the server ", items);
  let new_live = null;

  console.log("informatoon in the description: ", description);
  console.log("Inforamtion email: ", email);
  console.log("Information category ", category);

  try {
    new_live = await LiveSell.findOneAndUpdate(
      { email: email, state: "active" },
      {
        $set: {
          description: description,
          email: email,
          username: username,
          category: category,
          stream_key: stream_key,
          items: items,
          thumbnail: thumbnail,
          poster: poster,
          state: "active",
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.log("Error, ", err);
    res.send(JSON.stringify({ success: false, error: err }));
    return;
  }
  if (new_live) {
    console.log(
      "results afer updating the stream live, and if not existed, crrated the stream for the user",
      new_live
    );
    res.send(JSON.stringify({ success: true, livesell: new_live }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

router.post("/livesave", upload.none(), async (req, res) => {
  console.log("req to save live, ", req.body);

  let liveid = req.body.liveid;
  console.log("id for the live sell, ", liveid);

  // need to get stream_key from client
  let stream_key = req.body.stream_key;
  console.log("Steam key for user", stream_key);
  let videopath = await donesave(stream_key);
  console.log("file selected by the server", videopath);
  let frontendPath = {
    frontendPath: videopath,
    filetype: "video/mp4",
  };
  console.log("video file location, ", frontendPath);

  let room = liveid;

  // get messages from messages array for the room and save to the database
  //

  const { error, room_msg } = getMsgRoom(room);
  if (error) console.log("Error to get the messages from", error);
  console.log("Room messages saved", room_msg);

  let newLiveSell = null;

  try {
    newLiveSell = await LiveSell.findOneAndUpdate(
      { _id: liveid },
      {
        $set: {
          source: frontendPath,
          messages: room_msg.msgs,
          state: "completed",
        },
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

    // after the live completed, the message will be removed from the messages array
    //

    const { error, room_msg } = removeMsgRoom(room);
    if (error) console.log("Error to remove the messages room", error);
    console.log("Room messages removed", room_msg);

    let sellObj = {
      description: "",
      email: newLiveSell.email,
      username: newLiveSell.username,
      category: "",
      stream_key: newLiveSell.stream_key,
      items: [],
      state: "active",
    };
    let returnSell = await create(sellObj);

    if (returnSell) {
      res.send(JSON.stringify({ success: true, livesell: returnSell }));
      return;
    } else {
      res.send(JSON.stringify({ success: false }));
      return;
    }
  }
});
router.post("/new-item", upload.array("mfiles", 9), async (req, res) => {
  console.log("request to /new-item, body: ", req.body);

  let files = req.files;
  console.log("uploaded files", files);

  let frontendPaths = files.map((file) => {
    let filetype = file.mimetype;
    return { frontendPath: "/uploads/" + file.filename, filetype: filetype };
  });
  console.log("Frontend path array", frontendPaths);

  let insertReturn = await dbo
    .collection("filestable")
    .insertMany(frontendPaths);
  console.log("return after insert many in the table", insertReturn);

  let description = req.body.description;
  let price = parseFloat(req.body.price);
  let inventory = parseInt(req.body.inventory);
  let location = req.body.location;
  let seller = req.user.email;
  let defaultPaths = frontendPaths[0];
  dbo.collection("items").insertOne(
    {
      description,
      price,
      inventory,
      location,
      seller,
      defaultPaths,
      frontendPaths: insertReturn.insertedIds,
    },
    (error, item) => {
      if (error) {
        console.log("error with insert product to database, ", error);
        res.send(JSON.stringify({ success: false }));
        return;
      }

      if (item.insertedCount === 1) {
        dbo
          .collection("inventory")
          .insertOne(
            { _id: item.ops[0]._id, inventory: inventory },
            async (err, inventory) => {
              if (err) {
                console.log("error with the insert inventories, ", err);
                res.send(JSON.stringify({ success: false }));
                return;
              }
              //      let items = await getItems(req.user.email);

              res.send(JSON.stringify({ success: true, item: item.ops[0] }));
              return;
            }
          );
      }
    }
  );
});

let getStream = async (email) => {
  console.log("email to get stream live", email);
  let results = await LiveSell.findOne({ email: email, state: "active" });
  //console.log("search results for the carts", results);
  return results;
};
let getItems = async (email) => {
  let allitems = await dbo
    .collection("items")
    .find({ seller: email })
    .toArray();
  return allitems;
};

module.exports = { router, getStream, getItems, create };
