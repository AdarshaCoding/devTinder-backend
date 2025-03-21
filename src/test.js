const express = require("express");
const PROT = 5000;

const app = express();

/**
 * app.use("path", request_handler) : This will handle all the HTTMP methods like GET, POST, PATCH, PUT, DELETE
 * if we have to handle independently then use respective HTTP methods
 */

//GET : http://localhost:5000/user
//GET : http://localhost:5000/user?name="Adarsha"&city="Bengaluru"   ==> use req.query to retrieve the query params from the URL
app.get("/user", (req, res) => {
  console.log(req.query);
  userObj = {
    name: "Adarsha",
    city: "Bengaluru",
  };
  res.send(userObj);
});

//GET : http://localhost:5000/user/123/abc
app.get("/user/:userId/:name", (req, res) => {
  const { userId, postId } = req.params; // Access the parameters from req.params
  res.send(`User ID: ${userId}, Post ID: ${postId}`);
});

//POST : http://localhost:5000/user

app.post("/user", (req, res) => {
  res.send("Added user to database!!");
});

app.use("/", (req, res) => {
  res.send("Home Page!!");
});

app.listen(PROT, () => {
  console.log("Server is up and running!", PROT);
});
