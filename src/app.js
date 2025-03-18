const express = require("express");
const { userAuth, adminAuth } = require("./middleware/auth");
const PORT = 4000;
const app = express();

app.get("/user", userAuth, (req, res) => {
  console.log("User get request from DB");
  const user = {
    name: "Adarsha",
    age: "32",
  };
  res.send(user);
});
app.use("/admin", adminAuth);

app.get("/admin/getAllUsers", (req, res) => {
  res.send("Take all users data");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send("User is deleted!");
});

app.listen(PORT, () => {
  console.log("Sucessfully Server Started at Port#:", PORT);
});
