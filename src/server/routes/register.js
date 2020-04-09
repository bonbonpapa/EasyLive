const express = require("express"),
  router = express.Router(),
  passport = require("passport");
const { create } = require("./sell.js");

router.post("/", (req, res, next) => {
  passport.authenticate("localRegister", (err, user, info) => {
    console.log("Inside passport.authentificate() callback");
    console.log(
      `req.session.passport: ${JSON.stringify(req.session.passport)}`
    );
    console.log(`req.user: ${JSON.stringify(req.user)}`);

    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send(
        JSON.stringify({ success: false, err: "User not existed!" })
      );
    }

    req.login(user, async err => {
      console.log("Inside req.login() callback after register");
      console.log(
        `req.session.passport: ${JSON.stringify(req.session.passport)}`
      );
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      console.log("in Server after login succeed endpoint", req.user);

      let sellObj = {
        description: "",
        email: req.user.email,
        username: req.user.username,
        category: "",
        stream_key: req.user.stream_key,
        items: [],
        state: "active"
      };
      let returnSell = await create(sellObj);
      return res.send(
        JSON.stringify({
          success: true,
          streamlive: returnSell,
          user: user,
          items: []
        })
      );
    });
  })(req, res, next);
});

module.exports = router;
