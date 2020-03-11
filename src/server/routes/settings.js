const express = require("express"),
  router = express.Router(),
  User = require("../database/Schema.js").User,
  shortid = require("shortid");

router.get("/stream_key", (req, res) => {
  console.log("request from front end, ", req.user);

  if (req.user === undefined) {
    res.json({ success: false, stream_key: "" });
    return;
  }

  User.findOne({ email: req.user.email }, (err, user) => {
    if (!err) {
      res.json({
        stream_key: user.stream_key
      });
    }
  });
});

router.post("/stream_key", (req, res) => {
  if (req.user === undefined) {
    res.json({ success: false, stream_key: "" });
    return;
  }
  User.findOneAndUpdate(
    {
      email: req.user.email
    },
    {
      stream_key: shortid.generate()
    },
    {
      upsert: true,
      new: true
    },
    (err, user) => {
      if (!err) {
        res.json({
          stream_key: user.stream_key
        });
      }
    }
  );
});

module.exports = router;
