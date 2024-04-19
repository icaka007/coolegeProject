const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Предполагаме, че името на факултета е уникално
  },
  dean: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true // Всеки факултет има декан, който е отговорен за факултета
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
    // Не е маркирано като задължително, тъй като новосъздаден факултет може да няма веднага департаменти
  }]
}, { timestamps: true });

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
