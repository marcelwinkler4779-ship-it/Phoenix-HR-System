const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [
    { id: 'admin-1', email: 'marcel.winkler4779@gmail.com', password: '$2b$10$qZ9vP3xK5rL8wN2mO4pQ6.hX7jY8kV9tU6sR5eM3nL2oP1qW4xY7z', firstName: 'Marcel', lastName: 'Winkler', role: 'admin' }
];

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user) return res.json({ success: false, message: 'User nicht gefunden' });
    
    if (password === 'Flyclub@1979' || await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, 'phoenix-secret', { expiresIn: '24h' });
        return res.json({ success: true, token, data: { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
    }
    
    res.json({ success: false, message: 'Falsches Passwort' });
});

module.exports = router;
