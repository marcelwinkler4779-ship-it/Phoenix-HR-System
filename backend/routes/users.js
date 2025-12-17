const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const existing = await User.findOne({ email: req.body.email });
        if (existing) return res.json({ success: false, message: 'E-Mail existiert bereits' });
        const user = new User({ ...req.body, createdBy: req.userId });
        await user.save();
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.status = user.status === 'active' ? 'inactive' : 'active';
        await user.save();
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
