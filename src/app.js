const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const PORT = 4000;
const app = express();

app.post("/signup", async (req, res) => {
  // sample data, it can be the input from React App or Postman
  const userObj = {
    firstName: "Deepashree",
    lastName: "PK",
    emailId: "deepa@gmail.com",
    password: "deepa@123",
    age: 26,
    gender: "Female",
  };
  try {
    const user = new User(userObj); // model constructor, creating the instance of it
    await user.save(); // Saving the data to DB
    res.send("User Added Succssfully!");
  } catch (err) {
    res.status(400).send("Something went wrong while adding the user to DB!");
  }
});

//Always makesure DB is connected before listening to any incoming request
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
