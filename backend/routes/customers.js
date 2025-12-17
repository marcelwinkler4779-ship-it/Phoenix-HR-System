const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const customers = await Customer.find({ status: 'active' }).sort({ createdAt: -1 });
        res.json({ success: true, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const customer = new Customer({ ...req.body, createdBy: req.userId });
        await customer.save();
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, { status: 'inactive' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
