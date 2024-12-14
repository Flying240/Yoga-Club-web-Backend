const mongoose = require("mongoose");
const { User } = require("../models/model.js");

/**
 * Fetch all users.
 */
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users || users.length === 0) {
            return res
                .status(404)
                .json({ message: "No users found", ok: false });
        }
        return res
            .status(200)
            .json({
                message: "Users retrieved successfully",
                data: users,
                ok: true,
            });
    } catch (err) {
        console.error("Error fetching users:", err);
        return res
            .status(500)
            .json({
                message: "Failed to fetch users",
                error: err.message,
                ok: false,
            });
    }
};

/**
 * Fetch a single user by ID.
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found", ok: false });
        }
        return res
            .status(200)
            .json({
                message: "User retrieved successfully",
                data: user,
                ok: true,
            });
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        return res
            .status(500)
            .json({
                message: "Failed to fetch user",
                error: err.message,
                ok: false,
            });
    }
};

/**
 * Add a new user.
 */
const addUser = async (req, res) => {
    try {
        const { email, rollno } = req.body;

        // Check for duplicate user by email or rollno
        const duplicateUser = await User.findOne({
            $or: [{ email }, { rollno }],
        });
        if (duplicateUser) {
            return res
                .status(400)
                .json({ message: "User already exists", ok: false });
        }

        const newUser = { ...req.body };

        // Handle image upload if provided
        if (req.file) {
            newUser.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const user = new User(newUser);
        await user.save();

        return res
            .status(201)
            .json({
                message: "User created successfully",
                data: user,
                ok: true,
            });
    } catch (error) {
        console.error("Error adding user:", error);
        return res
            .status(500)
            .json({
                message: "Failed to create user",
                error: error.message,
                ok: false,
            });
    }
};

/**
 * Delete a user by ID.
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found", ok: false });
        }
        return res
            .status(200)
            .json({ message: "User deleted successfully", ok: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res
            .status(500)
            .json({
                message: "Failed to delete user",
                error: error.message,
                ok: false,
            });
    }
};

/**
 * Fetch a user's image by ID.
 */
const getUserImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.image) {
            return res
                .status(404)
                .json({ message: "Image not found", ok: false });
        }
        res.contentType(user.image.contentType);
        return res.send(user.image.data);
    } catch (err) {
        console.error("Error fetching user image:", err);
        return res
            .status(500)
            .json({
                message: "Failed to fetch image",
                error: err.message,
                ok: false,
            });
    }
};

/**
 * Update a user by ID.
 */
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found", ok: false });
        }
        return res
            .status(200)
            .json({
                message: "User updated successfully",
                data: user,
                ok: true,
            });
    } catch (err) {
        console.error("Error updating user:", err);
        return res
            .status(500)
            .json({
                message: "Failed to update user",
                error: err.message,
                ok: false,
            });
    }
};

module.exports = {
    getUsers,
    addUser,
    getUserById,
    deleteUser,
    getUserImage,
    updateUser,
};
