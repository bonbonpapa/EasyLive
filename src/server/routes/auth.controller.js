const { getStream, getItems, create } = require("./sell.js");

exports.twitter = (req, res) => {
  const io = req.app.get("io");
  const user = {
    name: req.user.username,
    photo: req.user.photos[0].value.replace(/_normal/, "")
  };
  io.in(req.session.socketId).emit("twitter", user);
  res.end();
};

exports.google = (req, res) => {
  const io = req.app.get("io");
  const user = {
    name: req.user.displayName,
    photo: req.user.photos[0].value.replace(/sz=50/gi, "sz=250")
  };
  io.in(req.session.socketId).emit("google", user);
  res.end();
};

exports.facebook = async (req, res) => {
  const io = req.app.get("io");
  const name = req.user.facebook.name;
  const email = req.user.facebook.email;
  const stream_key = req.user.stream_key;
  const photo = req.user.facebook.photo;

  let sellObj = {
    description: "",
    email: email,
    category: "",
    stream_key: stream_key,
    items: [],
    state: "active"
  };

  let returnSell = await create(sellObj);
  let items = await getItems(req.user.email);

  const user = {
    name: name,
    stream_key: stream_key,
    photo: photo,
    email: email
  };
  const userLogin = {
    user: user,
    sell: returnSell,
    items: items
  };
  io.in(req.session.socketId).emit("facebook", userLogin);
  console.log("socket io emit from the server to client", userLogin);
  res.end();
};

exports.github = (req, res) => {
  const io = req.app.get("io");
  const user = {
    name: req.user.username,
    photo: req.user.photos[0].value
  };
  io.in(req.session.socketId).emit("github", user);
  res.end();
};
