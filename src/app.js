const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");

const PORT = 4000;
const app = express();

//middleware functions
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req); //validate the req.body data even before creating the instance of a model
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    // hasing the plain password before storing it in DB
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
