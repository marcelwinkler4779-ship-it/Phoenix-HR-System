const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phoenix';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB verbunden'))
    .catch(err => console.error('❌ MongoDB Fehler:', err));

app.get('/api/health', (req, res) => {
    res.json({ status: 'online', timestamp: new Date(), uptime: process.uptime() });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

io.on('connection', (socket) => {
    console.log('Socket verbunden:', socket.id);
    socket.on('disconnect', () => console.log('Socket getrennt:', socket.id));
});

server.listen(PORT, () => {
    console.log('🔥 PHOENIX HR BACKEND GESTARTET');
    console.log('Port:', PORT);
    console.log('Datenbank:', mongoose.connection.readyState === 1 ? 'Verbunden ✅' : 'Getrennt ❌');
});

app.use(express.static('../'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../index.html');
});
