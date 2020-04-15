let mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs"),
  shortid = require("shortid"),
  Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  stream_key: String,
  shipping: {
    name: {
      firstname: String,
      lastname: String
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      address_state: String,
      postal_code: String,
      country: String
    }
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    photo: String
  }
});

UserSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateStreamKey = () => {
  return shortid.generate();
};

module.exports = UserSchema;
