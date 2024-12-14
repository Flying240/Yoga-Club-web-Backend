const mongoose = require('mongoose');
const { Merch } = require('../models/model.js');

/**
 * Fetch all merchandise.
 */
const getMerchs = async (req, res) => {
    try {
        const merchs = await Merch.find({});
        if (!merchs || merchs.length === 0) {
            return res.status(404).json({ message: "No merchandise found", ok: false });
        }
        return res.status(200).json({ message: "Merchandise retrieved successfully", data: merchs, ok: true });
    } catch (error) {
        console.error("Error retrieving merchandise:", error);
        return res.status(500).json({ message: "Failed to retrieve merchandise", error: error.message, ok: false });
    }
};

/**
 * Fetch a single merchandise item by ID.
 */
const getMerchById = async (req, res) => {
    try {
        const merch = await Merch.findById(req.params.id);
        if (!merch) {
            return res.status(404).json({ message: "Merchandise not found", ok: false });
        }
        return res.status(200).json({ message: "Merchandise retrieved successfully", data: merch, ok: true });
    } catch (error) {
        console.error("Error retrieving merchandise by ID:", error);
        return res.status(500).json({ message: "Failed to retrieve merchandise", error: error.message, ok: false });
    }
};

/**
 * Add new merchandise.
 */
const addMerch = async (req, res) => {
    try {
        const { name } = req.body;

        // Check for duplicate merchandise
        const duplicateMerch = await Merch.findOne({ name });
        if (duplicateMerch) {
            return res.status(400).json({ message: "Merchandise with the same name already exists", ok: false });
        }

        const newMerch = { ...req.body };
        if (req.file) {
            newMerch.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const merch = new Merch(newMerch);
        await merch.save();

        return res.status(201).json({ message: "Merchandise created successfully", data: merch, ok: true });
    } catch (error) {
        console.error("Error adding merchandise:", error);
        return res.status(500).json({ message: "Failed to add merchandise", error: error.message, ok: false });
    }
};

/**
 * Delete merchandise by ID.
 */
const deleteMerch = async (req, res) => {
    try {
        const deletedMerch = await Merch.findByIdAndDelete(req.params.id);
        if (!deletedMerch) {
            return res.status(404).json({ message: "Merchandise not found", ok: false });
        }
        return res.status(200).json({ message: "Merchandise deleted successfully", ok: true });
    } catch (error) {
        console.error("Error deleting merchandise:", error);
        return res.status(500).json({ message: "Failed to delete merchandise", error: error.message, ok: false });
    }
};

/**
 * Fetch merchandise image by ID.
 */
const getMerchImage = async (req, res) => {
    try {
        const merch = await Merch.findById(req.params.id);
        if (!merch || !merch.image) {
            return res.status(404).json({ message: "Merchandise image not found", ok: false });
        }
        res.contentType(merch.image.contentType);
        return res.send(merch.image.data);
    } catch (error) {
        console.error("Error retrieving merchandise image:", error);
        return res.status(500).json({ message: "Failed to retrieve image", error: error.message, ok: false });
    }
};

/**
 * Update merchandise by ID.
 */
const updateMerch = async (req, res) => {
    try {
        const updatedMerch = await Merch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMerch) {
            return res.status(404).json({ message: "Merchandise not found", ok: false });
        }
        return res.status(200).json({ message: "Merchandise updated successfully", data: updatedMerch, ok: true });
    } catch (error) {
        console.error("Error updating merchandise:", error);
        return res.status(500).json({ message: "Failed to update merchandise", error: error.message, ok: false });
    }
};

module.exports = {
    getMerchs,
    getMerchById,
    addMerch,
    deleteMerch,
    getMerchImage,
    updateMerch,
};
