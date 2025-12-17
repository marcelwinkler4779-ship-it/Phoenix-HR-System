const express = require('express');
const router = express.Router();
const Requirement = require('../models/Requirement');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const requirements = await Requirement.find()
            .populate('customerId', 'name city')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requirements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/open', verifyToken, async (req, res) => {
    try {
        const requirements = await Requirement.find({ status: 'open' })
            .populate('customerId', 'name city')
            .sort({ priority: -1, createdAt: -1 });
        res.json({ success: true, data: requirements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const requirement = new Requirement({ ...req.body, createdBy: req.userId });
        await requirement.save();
        const populated = await Requirement.findById(requirement._id).populate('customerId', 'name');
        res.json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const requirement = await Requirement.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('customerId', 'name');
        res.json({ success: true, data: requirement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/close', verifyToken, async (req, res) => {
    try {
        const requirement = await Requirement.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
        res.json({ success: true, data: requirement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Requirement.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
