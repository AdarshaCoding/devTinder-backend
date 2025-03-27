const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const PORT = 4000;
const app = express();

//middleware functions
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId: emailId.toLowerCase(),
      password: passwordHash,
      age,
      gender,
    });
    await user.save();
    res.send(`${user.firstName} Added Succssfully!`);
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

//POST : /login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }
    const passwordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);

    if (isPasswordCorrect) {
      const secretData = jwt.sign({ _id: user._id }, "DEV_SECRET@123");
      // console.log(secretData);
      res.cookie("token", secretData);

      res.send(user.firstName + " Login successfull!");
    } else {
      throw new Error("Invalid Credential!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies; // reading the cookies from client
    const { token } = cookies; // extract only the token and check it
    if (!token) {
      throw new Error("The token is not valid!");
    }
    // veriying the token against the SECRET KEY used while generating it
    const decodedData = jwt.verify(token, "DEV_SECRET@123");
    const userId = decodedData._id;
    const user = await User.findById(userId);
    res.send(user);
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

//Get all users feed
app.get("/feed", async (req, res) => {
  const queryData = req.query;
  console.log(queryData);
  try {
    const users = await User.find({});
    if (users.length == 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while fetching the user details");
  }
});

//Always make sure DB is connected before listening to any incoming request
connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log("The server is up and running at port#:", PORT);
    });
  })
  .catch((err) => {
    console.log("Something went wrong while connecting to DB!");
  });
