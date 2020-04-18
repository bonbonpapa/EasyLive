const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy,
  User = require("../database/Schema.js").User,
  shortid = require("shortid"),
  config = require("../config/default.js");

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

passport.use(
  "localRegister",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      //    console.log("informatoon in the req: ", req);
      console.log("if Session ID existed? ", req.sessionID);
      console.log("Inforamtion for auth, email: ", email);
      console.log("Information for auth, passord, ", password);
      User.findOne({ $or: [{ email: email }] }, (err, user) => {
        if (err) return done(err);
        if (user) {
          if (user.email === email) {
            req.flash("email", "Email is already taken");
          }
          // if (user.username === req.body.username) {
          //   req.flash("username", "Username is already taken");
          // }

          return done(null, false);
        } else {
          let user = new User();
          user.email = email;
          user.password = user.generateHash(password);
          user.username = req.body.username;
          user.stream_key = shortid.generate();
          user.save((err) => {
            if (err) throw err;
            return done(null, user);
          });
        }
      });
    }
  )
);

passport.use(
  "localLogin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      console.log("informatoon in the req: ", req.body);
      console.log("if Session ID existed? ", req.sessionID);
      console.log("Inforamtion for auth, email: ", email);
      console.log("Information for auth, passord, ", password);
      User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          return done(null, false, req.flash("email", "Email doesn't exist."));
        }

        if (!user.validPassword(password))
          return done(
            null,
            false,
            req.flash("password", "Oops! Wrong password.")
          );

        return done(null, user);
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK.clientID,
      clientSecret: config.FACEBOOK.clientSecret,
      callbackURL: config.Facebookcallback,
      profileFields: ["id", "displayName", "emails", "name", "photos"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("in the Facebook strategy, profile data", profile);
      User.findOne({ "facebook.id": profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        else {
          let user = new User();
          user.facebook.id = profile.id;
          user.facebook.token = accessToken;
          user.facebook.name = profile.displayName;

          if (
            typeof profile.emails !== "undefined" &&
            profile.emails.length > 0
          ) {
            user.facebook.email = profile.emails[0].value;
            user.email = user.facebook.email;
          } else {
            user.facebook.email = undefined;
            user.email = undefined;
          }

          if (
            typeof profile.photos !== "undefined" &&
            profile.photos.length > 0
          ) {
            user.facebook.photo = profile.photos[0].value;
          } else {
            user.facebook.email = undefined;
          }

          user.stream_key = shortid.generate();
          user.save((err) => {
            if (err) throw err;
            return done(null, user);
          });
        }
      });
    }
  )
);

module.exports = passport;
