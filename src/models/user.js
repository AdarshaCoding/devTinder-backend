const mongoose = require("mongoose");

//user schema, use camel casing - it is better always
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});
//creating the model constructor which will be used to create instance in other modules
const User = mongoose.model("User", userSchema);
module.exports = { User };
