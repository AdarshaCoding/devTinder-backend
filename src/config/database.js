const mongoose = require("mongoose");

// DB connection: connectionString/DB_name
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://adarshapc4467:UCeVlRQ63bn2oiEF@namastenode.hn59a.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
