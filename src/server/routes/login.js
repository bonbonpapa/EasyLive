const express = require("express"),
  router = express.Router(),
  passport = require("passport");

router.get("/", (req, res) => {
  res.render("login", {
    user: null,
    errors: {
      email: req.flash("email"),
      password: req.flash("password")
    }
  });
});

router.post(
  "/",
  passport.authenticate("localLogin", {
    successRedirect: "/succeed",
    failureRedirect: "/fail",
    failureFlash: true
  })
);

module.exports = router;
