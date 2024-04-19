const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Предполагаме, че името на департамента е уникално
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true // Предполагаме, че всяка департамент трябва да има ръководител
  },
  faculty: {
    type: String,
    required: true
  },
  professors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor'
  }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
