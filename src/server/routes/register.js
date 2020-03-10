const express = require("express"),
  router = express.Router(),
  passport = require("passport");

router.get(
  "/",
  (req, res) => {
    res.render("register", {
      user: null,
      errors: {
        username: req.flash("username"),
        email: req.flash("email")
      }
    });
  }
  // res.send(JSON.stringify({ success: false }));
);

router.post(
  "/",
  passport.authenticate("localRegister", {
    successRedirect: "/test",
    failureRedirect: "/register",
    failureFlash: true
  })
);

module.exports = router;
