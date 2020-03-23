const NodeMediaServer = require("node-media-server"),
  config = require("./config/default.js").rtmp_server,
  User = require("./database/Schema.js").User,
  LiveSell = require("./database/Schema.js").LiveSell,
  helpers = require("./helpers/helpers.js");

nms = new NodeMediaServer(config);

nms.on("prePublish", async (id, StreamPath, args) => {
  let stream_key = getStreamKeyFromStreamPath(StreamPath);
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  LiveSell.findOne(
    { stream_key: stream_key, state: "active" },
    (err, sellings) => {
      if (!err) {
        if (!sellings) {
          console.log(
            "From Media Server, no active live sell created, streaming rejected"
          );
          let session = nms.getSession(id);
          session.reject();
        } else {
          console.log(
            "From Media Server, active Live Stream information :",
            LiveSell
          );
          helpers.generateStreamThumbnail(stream_key);
        }
      }
    }
  );
  // User.findOne({ stream_key: stream_key }, (err, user) => {
  //   if (!err) {
  //     if (!user) {
  //       console.log("From Media Server, user not login, streaming rejected");
  //       let session = nms.getSession(id);
  //       session.reject();
  //     } else {
  //       console.log("From Media Server, user information :", user);
  //       helpers.generateStreamThumbnail(stream_key);
  //     }
  //   }
  // });
});
nms.on("postPublish", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on postPublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on("donePublish", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on donePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});
nms.on("postPlay", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on postPlay]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

nms.on("donePlay", (id, StreamPath, args) => {
  console.log(
    "[NodeEvent on donePlay]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
});

const getStreamKeyFromStreamPath = path => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

module.exports = nms;
