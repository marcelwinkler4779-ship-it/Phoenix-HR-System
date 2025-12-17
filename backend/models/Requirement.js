const mongoose = require('mongoose');
const requirementSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    position: { type: String, required: true },
    count: { type: Number, default: 1 },
    wage: { type: String },
    startDate: { type: Date },
    details: { type: String },
    priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
    status: { type: String, enum: ['open', 'filled', 'closed'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Requirement', requirementSchema);
