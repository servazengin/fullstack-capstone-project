const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = { user: { id: newUser.insertedId.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            const result = await bcryptjs.compare(req.body.password, theUser.password);
            if (!result) {
                return res.status(404).json({ error: 'Wrong password' });
            }

            const payload = { user: { id: theUser._id.toString() } };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            return res.json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });
        }
        return res.status(404).json({ error: 'User not found' });
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

// Update profile
router.put('/update', async (req, res) => {
    try {
        const email = req.headers.email;
        if (!email) {
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();

        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

        const payload = { user: { id: updatedUser._id.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken });
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
