const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    branch: { type: String },
    number: { type: String },
    address: { type: String },
    zip: { type: String },
    city: { type: String },
    contact: { type: String },
    contactPosition: { type: String },
    phone: { type: String },
    email: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Customer', customerSchema);
