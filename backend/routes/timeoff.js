const express = require('express');
const router = express.Router();
const TimeOff = require('../models/TimeOff');
const User = require('../models/User');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const query = req.userRole === 'employee' ? { userId: req.userId } : {};
        const requests = await TimeOff.find(query)
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/pending', verifyToken, async (req, res) => {
    try {
        const requests = await TimeOff.find({ status: 'pending' })
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const timeoff = new TimeOff({ ...req.body, userId: req.userId });
        await timeoff.save();
        const populated = await TimeOff.findById(timeoff._id).populate('userId', 'firstName lastName');
        res.json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/approve', verifyToken, async (req, res) => {
    try {
        const timeoff = await TimeOff.findById(req.params.id);
        if (!timeoff) return res.status(404).json({ success: false, message: 'Nicht gefunden' });
        timeoff.status = 'approved';
        timeoff.approvedBy = req.userId;
        timeoff.approvedAt = new Date();
        await timeoff.save();
        const user = await User.findById(timeoff.userId);
        if (user && timeoff.type === 'vacation') {
            user.usedVacationDays = (user.usedVacationDays || 0) + timeoff.days;
            await user.save();
        }
        res.json({ success: true, data: timeoff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/reject', verifyToken, async (req, res) => {
    try {
        const timeoff = await TimeOff.findByIdAndUpdate(req.params.id, 
            { status: 'rejected', approvedBy: req.userId, approvedAt: new Date() }, 
            { new: true });
        res.json({ success: true, data: timeoff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await TimeOff.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
