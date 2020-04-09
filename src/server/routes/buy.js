const express = require("express"),
  LiveSell = require("../database/Schema.js").LiveSell,
  mongoose = require("mongoose"),
  ObjectID = require("mongodb").ObjectID,
  multer = require("multer"),
  router = express.Router(),
  config = require("../config/default.js"),
  InitDb = require("../db.js").initDb,
  getDb = require("../db.js").getDb,
  fs = require("fs"),
  cors = require("cors");

let upload = multer({
  dest: __dirname + "/../uploads/"
});
let dbo = undefined;

InitDb(function(err) {
  if (err) {
    console.log("Error with the Mongodb database initializaion error ", err);
    return;
  }
  dbo = getDb();
});

router.get("/all-items", (req, res) => {
  console.log("request to /all-items");
  dbo
    .collection("items")
    .find({})
    .toArray((err, items) => {
      if (err) {
        console.log("error", err);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      // console.log("Items", items);
      res.send(JSON.stringify({ success: true, items: items }));
    });
});
router.get("/delete-cartitem", async (req, res) => {
  const pid = req.query.pid;
  console.log("delete item in the cart, prduct id: ", pid);
  //   const sessionId = req.cookies.sid;
  //   const user = sessions[sessionId];

  // need to check if the user existed
  const user = req.user;
  if (user) {
    try {
      newCart = await dbo
        .collection("carts")
        .findOneAndUpdate(
          { userId: String(user.userId), state: "active" },
          { $pull: { products: { _id: String(pid) } } },
          { returnOriginal: false }
        );
    } catch (err) {
      console.log("Error with delete item from Cart", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (newCart) {
      console.log("New cart updated ", newCart);
      res.send(JSON.stringify({ success: true, cart: newCart.value }));
      return;
    }
  }
  res.send(JSON.stringify({ success: false }));
});

router.post("/charge", cors(), async (req, res) => {
  // check if inventories can fullfil the order requirement
  // orderCheckfunc(req,res);
  console.log("in the orderCheck endpoiunt");
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  const userId = user.userId;
  const username = user.username;
  const inventory = dbo.collection("inventory");
  const carts = dbo.collection("carts");
  const orders = dbo.collection("orders");
  console.log("User ID ", userId);
  let cart = await carts.findOne({ userId: String(userId), state: "active" });
  let success = [];
  let failed = [];
  let charge = null;

  for (let i = 0; i < cart.products.length; i++) {
    let product = cart.products[i];
    let result = null;

    try {
      result = await inventory.findOneAndUpdate(
        {
          _id: ObjectID(product._id),
          inventory: { $gte: parseInt(product.quantity) }
        },
        {
          $inc: { inventory: -parseInt(product.quantity) },
          $push: {
            reservations: {
              quantity: parseInt(product.quantity),
              _id: cart._id,
              createdOn: new Date()
            }
          }
        }
      );
    } catch (err) {
      console.log("error ", err);
    }
    console.log(
      "results after updating the inventory with reservations ",
      result
    );
    if (result.lastErrorObject.updatedExisting) success.push(product);
    else failed.push(product);
  }
  console.log("Success array: ", success);
  console.log("Failed array,", failed);
  //if there are any products in the failed array, we need to rollback all the successful reservations into the
  //inventories collection.
  if (failed.length > 0) {
    for (let i = 0; i < success.length; i++) {
      let result = null;
      try {
        result = await inventory.findOneAndUpdate(
          {
            _id: ObjectID(success[i]._id),
            "reservations._id": cart._id
          },
          {
            $inc: { inventory: parseInt(success[i].quantity) },
            $pull: { reservations: { _id: cart._id } }
          },
          { returnOriginal: false }
        );
      } catch (err) {
        console.log("error, ", err);
      }
      console.log("results after rollback the inventories", result);
    }
    // res.send(JSON.stringify({ success: false }));
    res.status(500).json({
      message: "inventories cannot be reserved."
    });
    return;
  }

  // do the charge for the order
  //postCharge(req, res);
  try {
    const { amount, source, receipt_email } = req.body;

    charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source,
      receipt_email
    });

    if (!charge) throw new Error("charge unsuccessful");

    // not respone here, if charge succeesfully
    // res.status(200).json({
    //   message: "charge posted successfully",
    //   charge
    // });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

  // if charge success, then add the order and clear the cart;
  orders.insertOne({
    created_on: new Date(),
    userId: userId,
    shipping: {
      name: username,
      address: "Some street 1, NY 11223"
    },
    payment: {
      method: "visa",
      transaction_id: "231221441XXXTD"
    },
    products: cart.products
  });

  carts.findOneAndUpdate(
    {
      _id: ObjectID(cart._id),
      state: "active"
    },
    {
      $set: { state: "completed" }
    }
  );

  inventory.updateMany(
    {
      "reservations._id": cart._id
    },
    {
      $pull: { reservations: { _id: cart._id } }
    },
    { upsert: false }
  );

  //  res.send(JSON.stringify({ success: true }));

  res.status(200).json({
    message: "charge posted successfully",
    charge
  });
});

router.get("/get-orders", (req, res) => {
  console.log("request to the get orders");

  console.log("in the orderCheck endpoiunt");
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  const userId = user.userId;

  const username = req.query.username;
  console.log("username", username);

  dbo
    .collection("orders")
    .find({ userId: ObjectID(userId) })
    .toArray((err, orders) => {
      if (err) {
        console.log("/get orders", err);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (orders === null) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      console.log("Orders object", orders);
      res.send(JSON.stringify({ success: true, data: orders }));
    });
});

router.post("/add-cart", upload.none(), async (req, res) => {
  console.log("IN the add-car endpoint, body", req.body);

  const userId = req.body.userId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const description = req.body.description;
  const price = req.body.price;
  const existed = req.body.existedItem === "true" ? true : false;
  let newCart = null;

  if (existed) {
    try {
      newCart = await dbo.collection("carts").findOneAndUpdate(
        { userId: userId, state: "active", "products._id": productId },
        {
          $set: { modificationOn: new Date() },
          $inc: { "products.$.quantity": parseInt(quantity) }
        },
        { returnOriginal: false }
      );
    } catch (e) {
      console.log(
        "Error with the add add-cart when find and update a cart, ",
        e
      );
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (newCart) {
      console.log("New cart updated ", newCart);
      res.send(JSON.stringify({ success: true, cart: newCart.value }));
      return;
    }
  }

  try {
    newCart = await dbo.collection("carts").findOneAndUpdate(
      { userId: userId, state: "active" },
      {
        $set: { modificationOn: new Date() },
        $push: {
          products: {
            _id: productId,
            quantity: parseInt(quantity),
            description: description,
            price: price
          }
        }
      },
      { upsert: true, returnOriginal: false }
    );
  } catch (e) {
    console.log("Error with the add add-cart when find and update a cart, ", e);
    res.send(JSON.stringify({ success: false }));
    return;
  }
  if (newCart) {
    console.log("New cart updated ", newCart);
    res.send(JSON.stringify({ success: true, cart: newCart.value }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

router.get("/getmedia", (req, res) => {
  console.log("request to the get media");
  const mid = req.query.mid;

  dbo.collection("filestable").findOne({ _id: ObjectID(mid) }, (err, mpath) => {
    if (err) {
      console.log("/get media error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (mpath === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    console.log("mpath object", mpath);
    res.send(JSON.stringify({ success: true, mpath: mpath }));
  });
});

let getCart = async userId => {
  console.log("userID to get cart", userId);
  let results = await dbo
    .collection("carts")
    .findOne({ userId: String(userId), state: "active" });
  console.log("search results for the carts", results);
  return results;
};

module.exports = { router, getCart };
