const express = require("express");

const PORT = 4000;
const app = express();

app.get(
  "/user",
  (req, res, next) => {
    const token = "xyz123";
    const isUserAuthorized = token === "xyz12";
    if (!isUserAuthorized) {
      res.status(401).send("User is not authorized!");
    } else {
      next();
    }
  },
  (req, res) => {
    console.log("User get request from DB");
    const user = {
      name: "Adarsha",
      age: "32",
    };
    res.send(user);
  }
);

app.delete(
  "/admin",
  (req, res, next) => {
    const token = "xyz123";
    const isUserAuthorized = token === "xyz123";
    if (!isUserAuthorized) {
      res.status(401).send("User is not authorized!");
    } else {
      next();
    }
  },
  (req, res) => {
    res.send("User is deleted!");
  }
);

app.listen(PORT, () => {
  console.log("Sucessfully Server Started at Port#:", PORT);
});
