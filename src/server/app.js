const express = require("express"),
  path = require("path"),
  Session = require("express-session"),
  multer = require("multer"),
  cors = require("cors"),
  bodyParse = require("body-parser"),
  config = require("./config/default.js"),
  flash = require("connect-flash"),
  port = 4000,
  app = express(),
  http = require("http"),
  socketIo = require("socket.io"),
  // socketPort = 80,
  passport = require("./auth/passport.js"),
  MongoDb = require("mongodb"),
  InitDb = require("./db.js").initDb,
  GetDb = require("./db.js").getDb,
  MongoClient = MongoDb.MongoClient,
  mongoose = require("mongoose"),
  FileStore = require("session-file-store")(Session),
  LiveSell = require("./database/Schema.js").LiveSell,
  thumbnail_generator = require("./cron/thumbnails.js");

const { CLIENT_ORIGIN } = require("./config/default.js");

let dbo = undefined;
let url = config.mongodb_url.url;

mongoose.connect(url, {
  dbName: "easy-live",
  useNewUrlParser: true,
  useFindAndModify: false,
});

const dbgoo = mongoose.connection;
dbgoo.on("error", () => {
  console.log(">error occured from database");
});
dbgoo.once("open", () => {
  console.log("> successfully opened the database");
});

InitDb(function (err) {
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
  addMessage,
} = require("./users.js");

// API for the socket IO connection here
// const server = http.Server(app);
const server = http.createServer(app);
const io = socketIo(server);
// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
app.set("io", io);

// Add this on the top of app.js file
// next to all imports
const node_media_server = require("./media_server.js");

app.use("/", express.static("../../build"));
app.use("/", express.static("../../public"));
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
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use(
  Session({
    store: new FileStore({
      path: "server/sessions",
    }),
    secret: config.server.secret,
    maxAge: Date().now + 60 * 1000 * 30,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.get("/", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

io.on("connection", function (socket) {
  console.log("socket at connection,", socket.id);

  socket.on("create", ({ chatUser, room }, callback) => {
    const { error, user } = addUser({ socketid: socket.id, chatUser, room });
    console.log("User added to the socket", user);
    if (error) return callback(error);
    const { err, room_msg } = addMsgRoom(room);
    console.log("Room messages added", room_msg);
    if (err) return callback(err);
    socket.join(user.room);
    socket.emit("message", {
      user: "admin",
      text: `${user.username}, Chat room created.`,
    });
    callback();
  });

  // this is the event for the join event from the client
  // the user will join the room as defined user.room
  // because user (in the room) has attached the room information

  socket.on("join", ({ chatUser, room }, callback) => {
    const { error, user } = addUser({ socketid: socket.id, chatUser, room });
    console.log("User added to the socket", user);
    if (error) return callback(error);
    const { err, room_msg } = addMsgRoom(room);
    console.log("Room messages added", room_msg);
    if (err) return callback(err);
    socket.join(user.room);
    socket.emit("message", {
      user: "admin",
      text: `${user.username}, Welcome to room ${user.room}.`,
    });
    socket.emit("msgs", room_msg);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    console.log("Send message in the socket,", socket.id);
    console.log("user corresponding to the socket id", user);
    let msg = { user: user.username, text: message };

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
        text: `${user.username} has left.`,
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

// Register app routes
app.use("/login", require("./routes/login.js"));
app.use("/register", require("./routes/register.js"));
app.use("/settings", require("./routes/settings.js"));
app.use("/streams", require("./routes/streams.js"));
app.use("/user", require("./routes/user.js"));
app.use("/sell", require("./routes/sell.js").router);
app.use("/buy", require("./routes/buy.js").router);

app.get("/succeed", (req, res) => {
  res.send(JSON.stringify({ success: true }));
});
app.get("/fail", (req, res) => {
  res.send(JSON.stringify({ success: false }));
});

// Catch a start up request so that a sleepy Heroku instance can
// be responsive as soon as possible
app.get("/wake-up", (req, res) => res.send("👍"));

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

const { PORT = 4000, LOCAL_ADDRESS = "0.0.0.0" } = process.env;
//app.listen(port, () => console.log(`Server app is listening on ${port}!`));

// server is created with app opton, so only listen to the server is necessart

//server.listen(port, () => console.log(`Listening on port ${port}`));

//Change with process.env on the port for deplyment
server.listen(PORT, LOCAL_ADDRESS, () =>
  console.log(`Listening on port ${PORT}`)
);

node_media_server.run();
thumbnail_generator.start();
