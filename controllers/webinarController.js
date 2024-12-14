// mvcmodel/controllers/userController.js
const mongoose = require("mongoose");
const upload = require("../middleware/upload.js");
const express = require("express");
const { Webinar } = require("../models/model.js");

// Get all webinars
const getWebinar = async (req, res) => {
    try {
        const webinars = await Webinar.find({});
        if (!webinars || webinars.length === 0) {
            return res.status(404).send("No webinars found");
        }
        return res.status(200).json(webinars);
    } catch (err) {
        console.error("Unable to find webinars", err);
        return res.status(500).send("Failed to fetch webinars");
    }
};

// Get a specific webinar by ID
const getWebinarById = async (req, res) => {
    try {
        const webinar = await Webinar.findById(req.params.id);
        if (!webinar) {
            return res.status(404).send("Unable to find the webinar");
        }
        return res.status(200).json(webinar);
    } catch (err) {
        console.error("Error fetching webinar by ID:", err);
        return res.status(500).json({ error: err.message });
    }
};

// Add a new webinar
const addWebinar = async (req, res) => {
    try {
        // Check for duplicate webinar based on title or link
        const duplicateWebinar = await Webinar.findOne({
            $or: [{ title: req.body.title }, { link: req.body.link }],
        });
        if (duplicateWebinar) {
            return res.status(400).send("Webinar already exists");
        }

        const newWebinar = new Webinar(req.body);
        await newWebinar.save();
        return res.status(201).send("Webinar created successfully");
    } catch (error) {
        console.error("Error occurred while creating webinar:", error);
        return res.status(500).send("An error occurred");
    }
};

// Delete a webinar by ID
const deleteWebinar = async (req, res) => {
    try {
        const webinar = await Webinar.findByIdAndDelete(req.params.id);
        if (!webinar) {
            console.error("Webinar not found for deletion");
            return res.status(404).send("Cannot find webinar");
        }
        return res.status(200).send("Webinar deleted successfully");
    } catch (error) {
        console.error("Error occurred while deleting webinar:", error);
        return res.status(500).send("An error occurred");
    }
};

// Update a webinar by ID
const updateWebinar = async (req, res) => {
    try {
        const updatedWebinar = await Webinar.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        );
        if (!updatedWebinar) {
            return res.status(404).json({ error: "No webinar found" });
        }
        console.log("Webinar updated with data:", req.body);
        return res.status(200).send("Webinar updated successfully");
    } catch (err) {
        console.error("Error occurred while updating webinar:", err);
        return res.status(500).send("Webinar cannot be updated");
    }
};

module.exports = {
    getWebinar,
    addWebinar,
    getWebinarById,
    deleteWebinar,
    updateWebinar,
};
