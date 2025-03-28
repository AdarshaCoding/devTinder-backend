const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const PORT = 4000;
const app = express();

//middleware functions
app.use(express.json());
app.use(cookieParser());

const authRotuer = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRotuer);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

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
