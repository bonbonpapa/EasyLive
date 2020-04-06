const express = require("express"),
  router = express.Router(),
  passport = require("passport");
const { getStream, getItems } = require("./sell.js");

// router.post(
//   "/",
//   passport.authenticate("localLogin", {
//     successRedirect: "/succeed",
//     failureRedirect: "/fail",
//     failureFlash: true
//   })
// );

router.post("/", (req, res, next) => {
  passport.authenticate("localLogin", (err, user, info) => {
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
      console.log("Inside req.login() callback");
      console.log(
        `req.session.passport: ${JSON.stringify(req.session.passport)}`
      );
      console.log(`req.user: ${JSON.stringify(req.user)}`);
      console.log("in Server after login succeed endpoint", req.user);

      let streamLive = await getStream(req.user.email);
      let items = await getItems(req.user.email);

      return res.send(
        JSON.stringify({
          success: true,
          streamlive: streamLive,
          user: req.user,
          items: items.slice()
        })
      );
    });
  })(req, res, next);
});

router.get("/session", async (req, res) => {
  let streamLive = await getStream(req.user.email);
  let items = await getItems(req.user.email);

  if (req.user) {
    return res.send(
      JSON.stringify({
        success: true,
        streamlive: streamLive,
        user: req.user,
        items: items.slice()
      })
    );
  }
  res.send(JSON.stringify({ success: false }));
});

router.get("/logout", function(req, res) {
  console.log("in the logout endpoint, ", req.user);
  if (req.user !== undefined) {
    // req.logout();
    req.session.destroy(err => {
      if (!err)
        res.send(
          JSON.stringify({ success: true, message: "User logout successfully" })
        );
      else res.send(JSON.stringify({ success: false, message: err }));
    });
  } else res.send(JSON.stringify({ success: false, message: "User not existed" }));
});

module.exports = router;
