const mongoose = require('mongoose');
const { User, Merch, Event } = require('../models/model.js');

/**
 * Fetch all events.
 */
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found", ok: false });
        }
        return res.status(200).json({ message: "Events retrieved successfully", data: events, ok: true });
    } catch (error) {
        console.error("Error retrieving events:", error);
        return res.status(500).json({ message: "Failed to fetch events", error: error.message, ok: false });
    }
};

/**
 * Fetch a single event by ID.
 */
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found", ok: false });
        }
        return res.status(200).json({ message: "Event retrieved successfully", data: event, ok: true });
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        return res.status(500).json({ message: "Failed to fetch event", error: error.message, ok: false });
    }
};

/**
 * Add a new event.
 */
const addEvent = async (req, res) => {
    try {
        const { name } = req.body;

        // Check for duplicate event
        const duplicateEvent = await Event.findOne({ name });
        if (duplicateEvent) {
            return res.status(400).json({ message: "Event already exists", ok: false });
        }

        const newEvent = { ...req.body };
        if (req.file) {
            newEvent.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const event = new Event(newEvent);
        await event.save();

        return res.status(201).json({ message: "Event added successfully", data: event, ok: true });
    } catch (error) {
        console.error("Error adding event:", error);
        return res.status(500).json({ message: "Failed to add event", error: error.message, ok: false });
    }
};

/**
 * Delete an event by ID.
 */
const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found", ok: false });
        }
        return res.status(200).json({ message: "Event deleted successfully", ok: true });
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ message: "Failed to delete event", error: error.message, ok: false });
    }
};

/**
 * Fetch the image for an event by ID.
 */
const getEventImage = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event || !event.image) {
            return res.status(404).json({ message: "Image not found", ok: false });
        }
        res.contentType(event.image.contentType);
        return res.send(event.image.data);
    } catch (error) {
        console.error("Error fetching event image:", error);
        return res.status(500).json({ message: "Failed to fetch image", error: error.message, ok: false });
    }
};

/**
 * Update an event by ID.
 */
const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", ok: false });
        }
        return res.status(200).json({ message: "Event updated successfully", data: updatedEvent, ok: true });
    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ message: "Failed to update event", error: error.message, ok: false });
    }
};

module.exports = {
    getEvents,
    addEvent,
    getEventById,
    deleteEvent,
    getEventImage,
    updateEvent,
};
