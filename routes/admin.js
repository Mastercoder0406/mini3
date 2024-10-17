const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Villa= require('../models/villa');

// Admin Dashboard - View all users and camps
router.get('/dashboard', async (req, res) => {
    try {
        const users = await User.find({});
        const villas = await Villa.find({});
        res.render('dashboard', { users, villas });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading data");
    }
});

module.exports = router;
