const express = require("express"),
  router = express.Router(),
  multer = require("multer"),
  ObjectID = require("mongodb").ObjectID,
  User = require("../database/Schema.js").User;

let upload = multer({
  dest: __dirname + "/../uploads/"
});

router.get("/", (req, res) => {
  if (req.query.username) {
    User.findOne(
      {
        username: req.query.username
      },
      (err, user) => {
        if (err) return;
        if (user) {
          res.json({
            stream_key: user.stream_key
          });
        }
      }
    );
  } else {
    res.json({});
  }
});

router.post("/update-address", upload.none(), async (req, res) => {
  // const sessionId = req.cookies.sid;
  // const user = sessions[sessionId];

  const user = req.user;

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const line1 = req.body.address1;
  const line2 = req.body.address2;
  const city = req.body.city;
  const country = req.body.country;
  const postal_code = req.body.address_zip;
  const address_state = req.body.address_state;
  try {
    // result = await dbo.collection("users").findOneAndUpdate(
    result = await User.findOneAndUpdate(
      {
        _id: ObjectID(user._id)
      },
      {
        $set: {
          shipping: {
            name: { firstname, lastname },
            address: {
              line1,
              line2,
              city,
              address_state,
              postal_code,
              country
            }
          }
        }
      },
      { returnOriginal: false }
    );
  } catch (err) {
    console.log("error ", err);
  }
  if (result) {
    console.log(
      "results after updating the users with shipping address ",
      result
    );
    // sessions[sessionId] = {
    //   ...user,
    //   shipping: result.value.shipping
    // };
    res.send(JSON.stringify({ success: true, shipping: result.shipping }));
    return;
  }

  res.send(JSON.stringify({ success: false }));
});

module.exports = router;
