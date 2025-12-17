const mongoose = require('mongoose');
const timeOffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    days: { type: Number, required: true },
    type: { type: String, enum: ['vacation', 'sick', 'personal'], default: 'vacation' },
    note: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('TimeOff', timeOffSchema);
