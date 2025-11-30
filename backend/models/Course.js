const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswerIndex: Number
});

const moduleSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  quiz: [quizSchema]
});

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  instructorId: String,
  instructorName: String,
  category: String,
  thumbnailUrl: String,
  modules: [moduleSchema]
});

module.exports = mongoose.model('Course', courseSchema);