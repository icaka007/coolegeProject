const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String
    },
    address: {
      type: String
    }
    // Допълнителни полета като дата на раждане или идентификационен номер може да се добавят тук.
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  // Студентът може да има и други атрибути като година на обучение, специалност и др.
  major: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
