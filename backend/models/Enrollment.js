const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  progress: { type: Number, default: 0 },
  completedModuleIds: [String]
});

// Compound index to ensure unique enrollment per user per course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);