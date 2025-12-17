const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    position: { type: String },
    number: { type: String },
    wage: { type: String },
    startDate: { type: Date },
    notes: { type: String },
    skills: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Employee', employeeSchema);
