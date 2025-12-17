const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'supervisor', 'employee'], default: 'employee' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    vacationDays: { type: Number, default: 30 },
    usedVacationDays: { type: Number, default: 0 },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('User', userSchema);
