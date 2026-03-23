const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/authRoute");
const blogRoutes = require("./routes/blogRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => res.send("Blog Management API is running ✅"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message, status });
});

module.exports = app;
