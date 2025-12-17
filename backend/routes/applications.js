const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Employee = require('../models/Employee');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/accept', verifyToken, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ success: false, message: 'Nicht gefunden' });
        application.status = 'accepted';
        await application.save();
        const employee = new Employee({
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            phone: application.phone,
            position: application.position,
            skills: application.skills,
            notes: 'Aus Bewerbung uebernommen',
            createdBy: req.userId
        });
        await employee.save();
        res.json({ success: true, data: { application, employee } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id/reject', verifyToken, async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
