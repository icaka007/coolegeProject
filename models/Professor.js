const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
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
    officeAddress: {
      type: String
    }
    // Можете да добавите и друга персонална информация, като например дата на раждане, ако е необходимо.
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isHead: {
    type: Boolean,
    default: false
  }
  // Тук може да добавите други полета, които са специфични за преподавателите, като например ученa степен, изследователска област и т.н.
}, { timestamps: true });

const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;
