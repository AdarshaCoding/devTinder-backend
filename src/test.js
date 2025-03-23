const express = require("express");
const { adminAuth } = require("./middleware/auth");
const PROT = 5000;

const app = express();
app.use(express.json());

/**
 * Middleware : the routes which helps (like authorization, field validations ...) to reach the route handler
 * Request Handler: the route handler which sends the response back to client
 * app.get("/path", rH1, rH2, rH3, rH4)
 *  - rH1, rH2, rH3 => middlewares
 *  - rH4 => request handler
 *  - request handler can be grouped by []  => results will be same
 *     - app.get("/path", [rH1, rH2, rH3, rH4]) or app.get("/path", rH1, [rH2, rH3], rH4)
 */

app.get("/user", (req, res, next) => {
  console.log("Middleware 1");
  // res.send("Request Handler 1");
  next();
});

/**
 * Middlewares can be chained like below also
 *  "/admin" - route will match the next() of the same routes, it doesn't interfear with "/admin/abc" route
 *  even if it is in the middle of all "/admin" routes
 */

// app.use(adminAuth);

app.get("/admin/getUserDetails", adminAuth, (req, res) => {
  res.send("User details!");
});

app.delete("/admin/deleteUser", adminAuth, (req, res) => {
  res.send("User deleted!");
});

app.listen(PROT, () => {
  console.log("Server is up and running!", PROT);
});
