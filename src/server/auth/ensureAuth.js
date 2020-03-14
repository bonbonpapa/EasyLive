module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    // res.redirect("/users/login");
    res.json({ success: false, message: "no to login first" });
  }
};
