// Import required modules
const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const multer = require("multer");
const Route = require("./routes/routes.js");

// MongoDB connection URI
const apiUrl = "mongodb+srv://yogayogayoga:yogayogayoga@cluster0.2k0hk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Alternative for a cloud MongoDB cluster
// const apiUrl = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority";

// Initialize Express application
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
    .connect(apiUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Failed to connect to MongoDB", error));

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, "views")));

// Route configuration
app.use("/", Route);

// Start the server
app.listen(PORT, () => {
    console.log(`
Server is running at:
  - Main:        http://localhost:${PORT}
  - User Routes:
      - Users:   http://localhost:${PORT}/users
      - Images:  http://localhost:${PORT}/user/image
  - Authentication:
      - Login:   http://localhost:${PORT}/login
      - Register: http://localhost:${PORT}/register
  `);
});
