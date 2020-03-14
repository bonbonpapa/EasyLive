const express = require("express"),
  router = express.Router(),
  User = require("../database/Schema.js").User,
  shortid = require("shortid"),
  { ensureAuthenticated } = require("../auth/ensureAuth.js");

router.get("/stream_key", ensureAuthenticated, (req, res) => {
  console.log("request from front end, ", req.user);

  // here I implemented to check if the req.user existed, if it is undefined, then the user is not logiin,
  // and then ask the user to login

  // if (req.user === undefined) {
  //   res.json({ success: false, stream_key: "" });
  //   return;
  // }

  User.findOne({ email: req.user.email }, (err, user) => {
    if (!err) {
      res.json({
        success: true,
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
