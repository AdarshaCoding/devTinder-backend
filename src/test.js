const express = require("express");
const PROT = 5000;

const app = express();

/**
 * Order of routes matters.
 * "/" - default routes should be kep at last only.
 * "/test", "/test/xyz", "/test/xyz/abc" -> here, "/test" route is kind of home/default routes, it should be kept at last else "/test" route only will get executed even after you provide any routes follwed by "test"
 * Routes Orders would be like this - this only individual routes will be exectuted
 *  "/test/xyz/abc"
 *   "/test/xyz"
 *   "/test"
 */

/**
 * app.use("path", request_handler) : This will handle all the HTTMP methods like GET, POST, PATCH, PUT, DELETE
 * if we have to handle independently then use respective HTTP methods
 */

app.use("/test/xyz/abc", (req, res) => {
  res.send("xyz/abc route");
});

app.use("/test/xyz", (req, res) => {
  res.send("xyz route");
});

app.use("/test", (req, res) => {
  res.send("Testing Route!!");
});

app.use("/hello", (req, res) => {
  res.send("Hello Route!!");
});

app.use("/", (req, res) => {
  res.send("Home Page!!");
});

app.listen(PROT, () => {
  console.log("Server is up and running!", PROT);
});
