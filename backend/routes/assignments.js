const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('employeeId', 'firstName lastName position number')
            .populate('customerId', 'name city')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/active', verifyToken, async (req, res) => {
    try {
        const assignments = await Assignment.find({ status: { $nin: ['withdrawn', 'taken_over'] } })
            .populate('employeeId', 'firstName lastName position number')
            .populate('customerId', 'name city');
        res.json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/employee/:employeeId', verifyToken, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            employeeId: req.params.employeeId,
            status: { $nin: ['withdrawn', 'taken_over'] }
        }).populate('customerId', 'name city');
        res.json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const assignment = new Assignment({
            ...req.body,
            statusHistory: [{ status: req.body.status || 'presented', date: new Date(), changedBy: req.userId }],
            createdBy: req.userId
        });
        await assignment.save();
        const populated = await Assignment.findById(assignment._id)
            .populate('employeeId', 'firstName lastName position')
            .populate('customerId', 'name');
        res.json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status, date, notes } = req.body;
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ success: false, message: 'Nicht gefunden' });
        assignment.status = status;
        assignment.statusHistory.push({ status, date: date || new Date(), notes, changedBy: req.userId });
        if (['withdrawn', 'taken_over', 'terminated'].includes(status)) {
            assignment.endDate = date || new Date();
        }
        await assignment.save();
        res.json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
