const mongoose = require("mongoose");

//user schema, use camel casing - it is better always
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["Male", "Female", "Others"].includes(value)) {
        throw new Error("The Gender data is not valid!");
      }
    },
  },
});
//creating the model constructor which will be used to create instance in other modules
const User = mongoose.model("User", userSchema);
module.exports = { User };
