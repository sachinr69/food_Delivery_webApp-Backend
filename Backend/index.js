require("dotenv").config();  

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

app.use(express.json());
app.use(cors());


connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api",require("./ROUTES/CreateUser"));
app.use("/api",require("./ROUTES/DisplayData"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





