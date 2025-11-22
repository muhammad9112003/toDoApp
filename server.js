const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // لو عايز تشغل من Live Server
    credentials: true,
  })
);

// Connect MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Auth middleware
const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const jwt = require("jsonwebtoken");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
const userRoutes = require("./routes/users");
const todoRoutes = require("./routes/todos");

app.use("/users", userRoutes);
app.use("/todos", auth, todoRoutes);

// Home redirect
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
