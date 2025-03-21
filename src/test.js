const express = require("express");
const PROT = 5000;

const app = express();

/**
 * app.use("path", request_handler) : This will handle all the HTTMP methods like GET, POST, PATCH, PUT, DELETE
 * if we have to handle independently then use respective HTTP methods
 */

//GET : http://localhost:5000/user
app.get("/user", (req, res) => {
  userObj = {
    name: "Adarsha",
    city: "Bengaluru",
  };
  res.send(userObj);
});

//POST : http://localhost:5000/user
// Now, if I execute POST method from postman, the below default route gets executed as we don't have "post" route handler

app.use("/", (req, res) => {
  res.send("Home Page!!");
});

app.listen(PROT, () => {
  console.log("Server is up and running!", PROT);
});
