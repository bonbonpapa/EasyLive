const express = require("express"),
  router = express.Router(),
  User = require("../database/Schema.js").User;

router.get("/info", (req, res) => {
  // here to be decided, if the user need to de checked as login, as get info is for all the users.
  //the users can view the stream withou login
  // the logic here is to return ????

  // if (req.user === undefined) {
  //   res.json({ success: false, stream_key: "" });
  //   return;
  // }

  // what the return here ti check
  if (req.query.streams) {
    let streams = JSON.parse(req.query.streams);
    let query = { $or: [] };
    for (let stream in streams) {
      if (!streams.hasOwnProperty(stream)) continue;
      query.$or.push({ stream_key: stream });
    }

    User.find(query, (err, users) => {
      if (err) return;
      if (users) {
        res.json(users);
      }
    });
  }
});
module.exports = router;
