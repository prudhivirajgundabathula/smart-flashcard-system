const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./mongoose");
const flashcardRoutes = require("./routes/flashcard");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/", flashcardRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Smart Flashcard System API 🚀");
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});