const express = require("express"),
  path = require("path"),
  Session = require("express-session"),
  multer = require("multer"),
  bodyParse = require("body-parser"),
  config = require("./config/default.js"),
  flash = require("connect-flash"),
  port = 4000,
  shortid = require("shortid"),
  app = express(),
  http = require("http"),
  socketIo = require("socket.io"),
  socketPort = 80,
  passport = require("./auth/passport.js"),
  MongoDb = require("mongodb"),
  InitDb = require("./db.js").initDb,
  GetDb = require("./db.js").getDb,
  MongoClient = MongoDb.MongoClient,
  mongoose = require("mongoose"),
  FileStore = require("session-file-store")(Session),
  LiveSell = require("./database/Schema.js").LiveSell,
  thumbnail_generator = require("./cron/thumbnails.js");

let dbo = undefined;
let url = config.mongodb_url.url;

mongoose.connect(url, {
  dbName: "easy-live",
  useNewUrlParser: true,
  useFindAndModify: false
});

const dbgoo = mongoose.connection;
dbgoo.on("error", () => {
  console.log(">error occured from database");
});
dbgoo.once("open", () => {
  console.log("> successfully opened the database");
});

InitDb(function(err) {
  if (err) {
    console.log("Error with the Mongodb database initializaion error ", err);
    return;
  }
  dbo = GetDb();
});

// let upload = multer({
//   dest: __dirname + "/uploads/"
// });

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addMsgRoom,
  addMessage
} = require("./users.js");

// API for the socket IO connection here
const server = http.Server(app);
const io = socketIo(server);

server.listen(socketPort, () => console.log(`Listening on port ${socketPort}`));

let messages = [];
let sessions = {};

// Add this on the top of app.js file
// next to all imports
const node_media_server = require("./media_server.js");

app.use("/", express.static("build"));
app.use("/", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/thumbnails", express.static("thumbnails"));
app.use("/images", express.static(__dirname + "/uploads"));
app.use(flash());

// and call run() method at the end
// file where we start our web server

app.use(require("cookie-parser")());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

app.use(
  Session({
    store: new FileStore({
      path: "server/sessions"
    }),
    secret: config.server.secret,
    maxAge: Date().now + 60 * 1000 * 30,
    resave: true,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.get("/session", async (req, res) => {
//   const sessionId = req.cookies.sid;
//   const user = sessions[sessionId];
//   if (user) {
//     return res.send(
//       JSON.stringify({
//         success: true,
//         username: user.username,
//         userId: user.userId
//       })
//     );
//   }
//   res.send(JSON.stringify({ success: false }));
// });
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("socket at connection,", socket.id);
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log("User added to the socket", user);
    if (error) return callback(error);
    const { err, room_msg } = addMsgRoom({ id: socket.id, name, room });
    console.log("Room messages added", room_msg);
    if (err) return callback(err);
    socket.join(user.room);
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, Welcome to room ${user.room}.`
    });
    socket.emit("msgs", room_msg);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    console.log("Send message in the socket,", socket.id);
    console.log("user corresponding to the socket id", user);
    let msg = { user: user.name, text: message };

    io.to(user.room).emit("message", msg);

    addMessage({ room: user.room, msg });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log("disconnect event in the socket", socket.id);
    console.log("User disconnect from the socket", user);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

let login = (req, res) => {
  console.log("login", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  dbo.collection("users").findOne({ username: username }, async (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    let uPwd = user.password;
    if (uPwd === enteredPassword) {
      console.log("Password matches");
      let sessionId = generateId();
      console.log("generated id", sessionId);
      sessions[sessionId] = {
        username: username,
        userId: user._id
      };
      res.cookie("sid", sessionId);
      console.log("user ID in login", user._id);

      res.send(
        JSON.stringify({
          success: true,
          userId: user._id
        })
      );
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
};
// app.post("/login", upload.none(), login);

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

// Register app routes
app.use("/login", require("./routes/login.js"));
app.use("/register", require("./routes/register.js"));
app.use("/settings", require("./routes/settings.js"));
app.use("/streams", require("./routes/streams.js"));
app.use("/user", require("./routes/user.js"));
app.use("/sell", require("./routes/sell.js"));

// app.post("/logout", (req, res) => {
//   const sessionId = req.cookies.sid;
//   delete sessions[sessionId];

//   res.send(JSON.stringify({ success: true }));
// });
app.get("/logout", function(req, res) {
  console.log("in the logout endpoint, ", req);
  if (req.user !== undefined) {
    req.logout();
    res.send(JSON.stringify({ success: true }));
  } else res.send(JSON.stringify({ success: false }));
});

let getStream = async email => {
  console.log("email to get stream live", email);
  let results = await LiveSell.findOne({ email: email, state: "active" });
  //console.log("search results for the carts", results);
  return results;
};
let getItems = async email => {
  let allitems = await dbo
    .collection("items")
    .find({})
    .toArray();
  return allitems;
};
app.get("/succeed", async (req, res) => {
  console.log("in Server after login succeed endpoint", req.user);

  let streamLive = await getStream(req.user.email);
  let items = await getItems(req.user.email);
  // console.log("Items after loggin: ", items);

  res.send(
    JSON.stringify({
      success: true,
      streamlive: streamLive,
      user: req.user,
      items: items.slice()
    })
  );
});
app.get("/fail", (req, res) => {
  console.log("in Server test endpoint");

  res.send(JSON.stringify({ success: false }));
});
app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, () => console.log(`Server app is listening on ${port}!`));

node_media_server.run();
thumbnail_generator.start();
