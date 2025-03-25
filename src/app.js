const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const PORT = 4000;
const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
  const userObj = req.body;
  try {
    const user = new User(userObj);
    await user.save();
    res.send(`${user.firstName} Added Succssfully!`);
  } catch (err) {
    res.status(400).send(`Error: Email-ID is already registered!`);
  }
});

//This API will always provide first user which is found by the email requested
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const data = await User.findOne({ emailId: userEmail });
    if (!data) {
      res.status(404).send("Requested user email is not present!");
    } else {
      res.send(data);
    }
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});

//GET user feed by an emailId
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body?.emailId;
    const data = await User.find({ emailId: userEmail });
    if (data.length === 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(data);
    }
  } catch (err) {
    res.status(500).send(`Something went wrong!`);
  }
});

//DELETE, deleteOne
app.delete("/user", async (req, res) => {
  try {
    // const userId = req.body._id;
    // const user = await User.deleteOne({ userId });
    const userFirstName = req.body.firstName;
    // const user = await User.deleteOne({ firstName: userFirstName });  // Only first record will get delete even though you have multiple records with same firstName
    const user = await User.deleteMany({ firstName: userFirstName }); //Multiple records can be deleted
    if (!user) {
      res.status(404).send("User not found!");
    } else {
      res.send("User has been deleted!");
    }
  } catch (err) {
    res.status(500).send(`Something went wrong! ${err.message}`);
  }
});

// Update
app.patch("/user", async (req, res) => {
  try {
    const { emailId, firstName, gender } = req.body;
    console.log(emailId, firstName);
    const data = await User.updateOne(
      { emailId: emailId },
      { firstName: firstName, gender: gender },
      { runValidators: true }
    );

    if (data.matchedCount === 0) {
      res.status(404).send("User is not found!");
    } else {
      res.send(`The user is updated!`);
    }
  } catch (err) {
    res.status(500).send(`Something went wrong!, ${err.message}`);
  }
});

//Get all users feed
app.get("/feed", async (req, res) => {
  const queryData = req.query;
  console.log(queryData);
  try {
    // const users = await User.find({ emailId: queryData.emailId }); // model.any_method
    const users = await User.find({}); // model.any_method
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
