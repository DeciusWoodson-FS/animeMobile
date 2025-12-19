const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 3000;

const quoteRouter = require("./routes/quotes");
const authRouter = require("./routes/auth");

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/quotes", quoteRouter);
app.use("/auth", authRouter);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "../reactjs/build")));

app.get(/("*")/, (req, res) => {
  res.sendFile(path.join(__dirname, "../reactjs/build/index.html"));
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
