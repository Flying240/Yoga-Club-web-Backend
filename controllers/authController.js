const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/model.js");
require("dotenv").config();

/**
 * Controller to handle user login.
 */
const authoriseAccess = async (req, res) => {
    try {
        console.log("Login request received:", req.body);

        // Find user by email or rollno
        const user = await User.findOne({
            $or: [{ email: req.body.email }, { rollno: req.body.email }],
        });

        if (!user) {
            return res
                .status(404)
                .json({ message: "Account does not exist", ok: false });
        }

        // Compare the provided password with the stored hash
        const match = await bcrypt.compare(req.body.password, user.password);

        if (!match) {
            console.log("Incorrect password");
            return res
                .status(400)
                .json({ message: "Invalid credentials", ok: false });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.TOKEN, {
            expiresIn: "24h",
        });

        console.log("Login successful");
        return res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
            },
            ok: true,
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

/**
 * Controller to handle user registration.
 */
const register = async (req, res) => {
    console.log("Registration request received:", req.body);

    try {
        const { email, password, rollno } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { rollno }],
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User already exists", ok: false });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            ...req.body,
            password: hashedPassword,
        });

        await newUser.save();

        console.log("User registered successfully");
        return res.status(201).json({
            message: "User registered successfully",
            ok: true,
        });
    } catch (error) {
        console.error("Error during registration:", error.message);
        return res
            .status(500)
            .json({ message: "Failed to register user", error: error.message });
    }
};

module.exports = { authoriseAccess, register };
