const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] } });

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phoenix';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('MongoDB verbunden');
        const User = require('./models/User');
        const adminExists = await User.findOne({ email: 'marcel.winkler4779@gmail.com' });
        if (!adminExists) {
            await User.create({ firstName: 'Marcel', lastName: 'Winkler', email: 'marcel.winkler4779@gmail.com', password: 'Flyclub@1979', role: 'admin', status: 'active', vacationDays: 30 });
        }
        const tmExists = await User.findOne({ email: 'team1@phoenix.de' });
        if (!tmExists) {
            await User.create({ firstName: 'Team', lastName: 'Manager 1', email: 'team1@phoenix.de', password: 'team123', role: 'supervisor', status: 'active', vacationDays: 30 });
        }
    })
    .catch(err => console.error('MongoDB Fehler:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/requirements', require('./routes/requirements'));
app.use('/api/timeoff', require('./routes/timeoff'));
app.use('/api/applications', require('./routes/applications'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'online' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

server.listen(PORT, () => {
    console.log('PHOENIX HR auf Port', PORT);
});
