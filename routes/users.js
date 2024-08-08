

const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, gstNumber } = req.body;
    const user = new User({ name, email, gstNumber });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('User registration error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;