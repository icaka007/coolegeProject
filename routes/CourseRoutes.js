const express = require('express');
const router = express.Router();

// Import the Course model
const Course = require('../models/Course');

// Dummy authentication service that you would replace with real authentication logic
const AuthService = {
  // Validates the user's token and returns their role
  getUserRoleFromToken: (token) => {
    // Placeholder logic: In a real scenario, validate the token and retrieve the user's role
    // For this example, let's assume everyone is an 'admin'
    return 'admin'; 
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

// GET route to fetch all courses
router.get('/courses', checkAuth, (req, res) => {
  Course.find()
    .then(courses => res.json(courses))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST route to create a new course
router.post('/courses', checkAuth, (req, res) => {
  const newCourse = new Course(req.body);
  newCourse.save()
    .then(() => res.json('Course added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to fetch a single course by id
router.get('/courses/:id', checkAuth, (req, res) => {
  Course.findById(req.params.id)
    .then(course => res.json(course))
    .catch(err => res.status(400).json('Error: ' + err));
});

// PUT route to update a course by id
router.put('/courses/:id', checkAuth, (req, res) => {
  Course.findById(req.params.id)
    .then(course => {
      course.name = req.body.name;
      course.code = req.body.code;
      course.credits = req.body.credits;
      course.department = req.body.department;
      course.professor = req.body.professor;
      course.save()
        .then(() => res.json('Course updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE route to delete a course by id
router.delete('/courses/:id', checkAuth, (req, res) => {
  Course.findByIdAndDelete(req.params.id)
    .then(() => res.json('Course deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
