const express = require("express");
const PROT = 5000;

const app = express();

/**
 * Middleware : the routes which helps (like authorization, field validations ...) to reach the route handler
 * Request Handler: the route handler which sends the response back to client
 * app.get("/path", rH1, rH2, rH3, rH4)
 *  - rH1, rH2, rH3 => middlewares
 *  - rH4 => request handler
 *  - request handler can be grouped by []  => results will be same
 *     - app.get("/path", [rH1, rH2, rH3, rH4]) or app.get("/path", rH1, [rH2, rH3], rH4)
 */

app.get(
  "/user",
  (req, res, next) => {
    console.log("Middleware 1");
    // res.send("Request Handler 1");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 2");
    //res.send("Request Handler 2");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 3");
    // res.send("Request Handler 3");
    next();
  },
  (req, res) => {
    console.log("Request Handler 4");
    res.send("Request Handler 4");
  }
);

/**
 * Middlewares can be chained like below also
 *  "/admin" - route will match the next() of the same routes, it doesn't interfear with "/admin/abc" route
 *  even if it is in the middle of all "/admin" routes
 */

app.get("/admin", (req, res, next) => {
  console.log("Middleware 1");
  next();
});

app.get("/admin/abc", (req, res) => {
  console.log("Request handler, /admin/abc");
  res.send("Request handler, /admin/abc");
});

app.get("/admin", (req, res, next) => {
  console.log("Middleware 2");
  next();
});

app.get("/admin", (req, res) => {
  console.log("Admin: request handler");
  res.send("Admin: request handler");
});

app.listen(PROT, () => {
  console.log("Server is up and running!", PROT);
});
