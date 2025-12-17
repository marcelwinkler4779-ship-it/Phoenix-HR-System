const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    position: { type: String, required: true },
    salary: { type: String },
    startDate: { type: Date },
    skills: [{ type: String }],
    status: { type: String, enum: ['new', 'accepted', 'rejected'], default: 'new' },
    gdprConsent: { type: Boolean, default: false },
    gdprConsentDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Application', applicationSchema);
