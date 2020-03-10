const express = require("express"),
  path = require("path"),
  Session = require("express-session"),
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
  MongoClient = MongoDb.MongoClient,
  ObjectID = MongoDb.ObjectID,
  mongoose = require("mongoose"),
  middleware = require("connect-ensure-login"),
  FileStore = require("session-file-store")(Session),
  thumbnail_generator = require("./cron/thumbnails.js");

mongoose.connect("mongodb://127.0.0.1:27017/easylive", {
  useNewUrlParser: true
});

let dbo = undefined;
let url = config.mongodb_url.url;
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  dbo = client.db("media-board");
});
// let dbo = undefined;
// let url = config.mongodb_url.url;
// MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
//   dbo = client.db("media-board");
// });

// let upload = multer({
//   dest: __dirname + "/uploads/"
// });

// API for the socket IO connection here
const server = http.Server(app);
const io = socketIo(server);

server.listen(socketPort, () => console.log(`Listening on port ${socketPort}`));

let messages = [];
let sessions = {};
let stream_key = "";
// Add this on the top of app.js file
// next to all imports
const node_media_server = require("./media_server.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use("/", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/thumbnails", express.static("server/thumbnails"));
app.use("/images", express.static(__dirname + "/uploads"));
app.use(flash());

// and call run() method at the end
// file where we start our web server

app.use(require("cookie-parser")());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());
// // // app.use(bodyParse.urlencoded({ extended: true }));
// app.use(bodyParse.json());

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

let clients = 0;
io.on("connection", function(socket) {
  clients++;
  let clientMsg = { name: "admin", message: "new user connection" };
  messages = messages.concat(clientMsg);
  io.sockets.emit("broadcast", { messages: messages });
  console.log("New client connected");

  socket.on("clientEvent", function(data) {
    messages = messages.concat(data);
    io.sockets.emit("broadcast", { messages: messages });
    console.log(data);
  });

  socket.on("disconnect", function() {
    clients--;
    io.socket.emit("broadcast", {
      description: clients + " clients connected!"
    });
    console.log("Client disconnected");
  });
});

app.get("/stream_key", (req, res) => {
  // res.json({ stream_key: stream_key });
  res.json({ stream_key: "FFVSZpXk" });
});
app.post("/stream_key", (req, res) => {
  //stream_key = shortid.generate();
  stream_key = "FFVSZpXk";
  res.json({ stream_key: stream_key });
});
app.get("/user", (req, res) => {
  let username = req.query.username;
  console.log("username of the streamung", username);

  res.json({
    stream_key: "FFVSZpXk"
  });
});
app.get("/info", (req, res) => {
  console.log(req.query.streams);
  if (req.query.streams) {
    let streams = JSON.parse(req.query.streams);
    let query = { $or: [] };
    for (let stream in streams) {
      if (!streams.hasOwnProperty(stream)) continue;
      query.$or.push({ stream_key: stream });
    }

    res.json([{ username: "pi", stream_key: stream_key }]);
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

app.get("/messages", function(req, res) {
  res.send(
    JSON.stringify({
      success: true,
      messages: messages
    })
  );
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

app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sid;
  delete sessions[sessionId];
  res.send(JSON.stringify({ success: true }));
});

app.get("/test", (req, res) => {
  console.log("in Server test endpoint");
  res.send(JSON.stringify({ success: true }));
});
app.get("*", middleware.ensureLoggedIn(), (req, res) => {
  res.render("index");
});
app.listen(port, () => console.log(`Server app is listening on ${port}!`));

node_media_server.run();
thumbnail_generator.start();
