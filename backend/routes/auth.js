nano backend/routes/auth.js
nano backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'phoenix-secret-key-2025';

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: 'Benutzer nicht gefunden' });
        if (user.status !== 'active') return res.json({ success: false, message: 'Konto deaktiviert' });
        if (password !== user.password) return res.json({ success: false, message: 'Falsches Passwort' });
        user.lastLogin = new Date();
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, vacationDays: user.vacationDays, usedVacationDays: user.usedVacationDays }});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Fehler' });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Kein Token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Ungueltig' });
    }
};

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Fehler' });
    }
});

module.exports = router;
module.exports.verifyToken = verifyToken;
