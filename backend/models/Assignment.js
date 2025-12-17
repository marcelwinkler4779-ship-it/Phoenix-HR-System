const mongoose = require('mongoose');
const statusHistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });
const assignmentSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    position: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ['presented', 'leased', 'placed', 'taken_over', 'withdrawn', 'terminated', 'sick'], default: 'presented' },
    notes: { type: String },
    statusHistory: [statusHistorySchema],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Assignment', assignmentSchema);
