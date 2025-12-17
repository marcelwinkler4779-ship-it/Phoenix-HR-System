const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const employees = await Employee.find({ status: 'active' }).sort({ createdAt: -1 });
        res.json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const employee = new Employee({ ...req.body, createdBy: req.userId });
        await employee.save();
        res.json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, { status: 'inactive' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
