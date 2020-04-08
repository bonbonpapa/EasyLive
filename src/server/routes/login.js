const express = require("express"),
  router = express.Router(),
  passport = require("passport");
const { getStream, getItems } = require("./sell.js");
const authController = require("./auth.controller.js");

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
  if (req.user) {
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

const facebookAuth = passport.authenticate("facebook");

// router.get("/auth/facebook", passport.authenticate("facebook"));
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/succeed",
//     failureRedirect: "/fail"
//   })
// );
router.get("/facebook/callback", facebookAuth, authController.facebook);
// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right
// socket
router.use((req, res, next) => {
  console.log(
    "in the middle ware to attach socket id to the session",
    req.query.socketId
  );
  req.session.socketId = req.query.socketId;
  console.log("req session", req.session);
  next();
});
router.get("/facebook", facebookAuth);
// router.get("/succeed", (req, res) => {
//   res.send(JSON.stringify({ success: true }));
// });
// router.get("/fail", (req, res) => {
//   res.send(JSON.stringify({ success: false }));
// });
module.exports = router;
