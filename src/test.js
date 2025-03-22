const express = require("express");
const fs = require("node:fs");
const PROT = 5000;

const app = express();

function getTimestamp() {
  const now = new Date();
  return `${now.toISOString()}`;
}

function logMessage(message) {
  const logDetails = `${getTimestamp()} - ${message}\n`;
  return logDetails;
}

app.get("/user", (req, res) => {
  res.send("Hello User!");
});

app.delete("/user", (req, res) => {
  try {
    const { emailId, phone } = req.query;
    const message = `The deleted user details - ${emailId} - ${phone}`;
    fs.appendFile("./userLogs.txt", logMessage(message), (err) => {
      if (err) {
        console.log("Error while updating the logs", err);
        return;
      }
    });
    res.send(
      `User is deleted! \n The requested email id & phone: ${emailId} - ${phone}`
    );
  } catch (err) {
    console.log(err);
  }
});
app.listen(PROT, () => {
  console.log("Server is up and running!", PROT);
});
