const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//user schema, use camel casing - it is better always
const userSchema = new mongoose.Schema(
  {
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email ID is not valid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 150,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("The password is not strong!");
        }
      },
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
    skills: {
      type: [String],
      default: ["JavaScript"],
      validate(value) {
        if (value.length > 5) {
          throw new Error("Skills cannot be more than 5!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://media.licdn.com/dms/image/v2/D5603AQGCNfZhwn_-HA/profile-displayphoto-shrink_400_400/B56ZSMdw_4HsAg-/0/1737523401972?e=1748476800&v=beta&t=xVG8ed72FHiOD3LpZLTzBjVgwiiaGJG-EaolSNxUhJ0",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
    },
    about: {
      type: String,
      maxLength: 1000,
    },
  },
  { timestamps: true }
);
//Instance methods - all the user instance will be attached with this method
userSchema.methods.getJWT = async function () {
  const user = this;
  const secretData = await jwt.sign({ _id: user._id }, "DEV_SECRET@123", {
    expiresIn: "1d",
  });
  return secretData;
};

userSchema.methods.verifyPassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordCorrect = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordCorrect;
};
//creating the model constructor which will be used to create instance in other modules
const User = mongoose.model("User", userSchema);
module.exports = { User };
