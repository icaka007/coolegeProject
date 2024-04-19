const express = require('express');
const router = express.Router();

// Import the Student model
const Student = require('../models/Student');

// Dummy authentication service that you would replace with real authentication logic
const AuthService = {
  getUserRoleFromToken: (token) => {
    // Placeholder logic: In a real scenario, validate the token and retrieve the user's role
    // For this example, let's assume roles include 'admin', 'professor', and 'student'
    return 'admin'; // Default to admin for simplicity in this example
  }
};

// Middleware for checking if user is authenticated and authorized
const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is provided as a Bearer token

  if (!token) {
    return res.status(401).json('No token provided');
  }

  const userRole = AuthService.getUserRoleFromToken(token);
  if (userRole !== 'admin' && userRole !== 'professor') {
    return res.status(403).json('Unauthorized: Insufficient permissions');
  }

  // User is authenticated and authorized, continue to the next middleware
  next();
};

// GET route to fetch all students
router.get('/students', checkAuth, (req, res) => {
  Student.find()
    .populate('department enrolledCourses')  // Assuming 'department' and 'enrolledCourses' are fields in the Student model
    .then(students => res.json(students))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST route to create a new student
router.post('/students', checkAuth, (req, res) => {
  const newStudent = new Student(req.body);
  newStudent.save()
    .then(() => res.json('Student added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to fetch a single student by id
router.get('/students/:id', checkAuth, (req, res) => {
  Student.findById(req.params.id)
    .populate('department enrolledCourses')
    .then(student => res.json(student))
    .catch(err => res.status(400).json('Error: ' + err));
});

// PUT route to update a student by id
router.put('/students/:id', checkAuth, (req, res) => {
  Student.findById(req.params.id)
    .then(student => {
      student.personalInfo = req.body.personalInfo || student.personalInfo;
      student.department = req.body.department || student.department;
      student.enrolledCourses = req.body.enrolledCourses || student.enrolledCourses;
      student.major = req.body.major || student.major;
      student.save()
        .then(() => res.json('Student updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE route to delete a student by id
router.delete('/students/:id', checkAuth, (req, res) => {
  Student.findByIdAndDelete(req.params.id)
    .then(() => res.json('Student deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
