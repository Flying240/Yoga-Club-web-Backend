// Import mongoose library for MongoDB interactions
const mongoose = require("mongoose");

// Define the schema for user data
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's full name
    rollno: { type: String, required: true, unique: true }, // Unique identifier for each user
    email: { type: String, required: true }, // User's email address
    password: { type: String, required: true }, // Encrypted user password
    semester: { type: Number }, // Current semester of the user
    credits: { type: Number }, // Total credits earned by the user
    member: { type: String }, // Membership type (e.g., premium, standard)
    eventsParticipated: { type: Number }, // Count of events the user has participated in
    attendance: { type: Number }, // User's attendance percentage
    image: {
        data: Buffer, // Image data stored as a binary buffer
        contentType: String, // MIME type of the image (e.g., "image/png")
    },
});

// Define the schema for event data
const eventSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Event name
    venue: { type: String }, // Location of the event
    date: { type: Number }, // Event date in a numeric format (e.g., timestamp)
    time: { type: String }, // Time of the event
    guest: { type: String }, // Guest speaker or host
    seats: { type: Number }, // Number of seats available
    description: { type: String }, // Description of the event
    image: {
        data: Buffer, // Event image stored as binary data
        contentType: String, // MIME type of the image
    },
});

// Define the schema for merchandise data
const merchSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Merchandise name
    price: { type: Number, required: true }, // Price of the merchandise
    description: { type: String }, // Description of the merchandise
    image: {
        data: Buffer, // Image of the merchandise
        contentType: String, // MIME type of the image
    },
});

// Define the schema for webinar data
const webinarSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Webinar title
    venue: { type: String }, // Webinar location (if applicable)
    date: { type: String, required: true }, // Webinar date in string format
    time: { type: String, required: true }, // Time of the webinar
    link: { type: String, required: true }, // Webinar link (e.g., Zoom/Google Meet link)
    description: { type: String }, // Additional details about the webinar
});

// Create models for each schema
const User = mongoose.model("User", userSchema); // Model for user data
const Event = mongoose.model("Event", eventSchema); // Model for event data
const Merch = mongoose.model("Merch", merchSchema); // Model for merchandise data
const Webinar = mongoose.model("Webinar", webinarSchema); // Model for webinar data

// Export the models to use them in other parts of the application
module.exports = {
    User,
    Event,
    Merch,
    Webinar,
};
