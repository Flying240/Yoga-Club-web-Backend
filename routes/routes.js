const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

// Import middleware
const upload = require("../middleware/upload.js");
const authenticate = require("../middleware/authenticate.js");

// Import controllers
const userController = require("../controllers/userController.js");
const eventController = require("../controllers/eventController.js");
const merchController = require("../controllers/merchController.js");
const authController = require("../controllers/authController.js");
const webinarController = require("../controllers/webinarController.js");

// Initialize the router
const Route = express.Router();

// CORS configuration
Route.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Serve static files
Route.use(express.static(path.join(__dirname, "../views")));

// Base route for the home page
Route.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "index.html"));
});

// Authentication routes
Route.post("/login", authController.authoriseAccess);
Route.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "login.html"));
});

Route.post("/register", upload.none(), authController.register);
Route.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "register.html"));
});

// User routes
Route.post(
    "/users",
    authenticate,
    upload.single("image"),
    userController.addUser
);
Route.get("/users", authenticate, userController.getUsers);
Route.get("/user/:id", authenticate, userController.getUserById);
Route.get("/user/image/:id", userController.getUserImage);
Route.put("/user/:id", userController.updateUser);
Route.delete("/users/:id", authenticate, userController.deleteUser);

// Event routes
Route.post(
    "/events",
    authenticate,
    upload.single("image"),
    eventController.addEvent
);
Route.get("/events", authenticate, eventController.getEvents);
Route.get("/event/:id", authenticate, eventController.getEventById);
Route.get("/event/image/:id", eventController.getEventImage);
Route.put("/event/:id", eventController.updateEvent);
Route.delete("/events/:id", authenticate, eventController.deleteEvent);

// Merchandise routes
Route.post(
    "/merchs",
    authenticate,
    upload.single("image"),
    merchController.addMerch
);
Route.get("/merchs", authenticate, merchController.getMerchs);
Route.get("/merch/:id", authenticate, merchController.getMerchById);
Route.get("/merch/image/:id", merchController.getMerchImage);
Route.put("/merch/:id", merchController.updateMerch);
Route.delete("/merchs/:id", authenticate, merchController.deleteMerch);

// Webinar routes
Route.post("/webinar", authenticate, webinarController.addWebinar);
Route.get("/webinar", webinarController.getWebinar);
Route.put("/webinar/:id", authenticate, webinarController.updateWebinar);
Route.delete("/webinar/:id", authenticate, webinarController.deleteWebinar);

// Export the router

Route.get('/secure-data', authenticate, (req, res) => {
    res.json({ message: "You have access to secure data.", user: req.user });
});

module.exports = Route;