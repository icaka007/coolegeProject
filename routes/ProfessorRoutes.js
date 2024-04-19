const express = require('express');
const router = express.Router();

// Import the Professor model
const Professor = require('../models/Professor');

// Dummy authentication service that you would replace with real authentication logic
const AuthService = {
  getUserRoleFromToken: (token) => {
    // Placeholder logic: In a real scenario, validate the token and retrieve the user's role
    // For this example, let's assume 'admin' and 'headOfDepartment' are valid roles
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
  if (userRole !== 'admin' && userRole !== 'headOfDepartment') {
    return res.status(403).json('Unauthorized: Insufficient permissions');
  }

  // User is authenticated and authorized, continue to the next middleware
  next();
};

// GET route to fetch all professors
router.get('/professors', checkAuth, (req, res) => {
  Professor.find()
    .populate('department courses')  // Assuming 'department' and 'courses' are fields in the Professor model
    .then(professors => res.json(professors))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST route to create a new professor
router.post('/professors', checkAuth, (req, res) => {
  const newProfessor = new Professor(req.body);
  newProfessor.save()
    .then(() => res.json('Professor added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to fetch a single professor by id
router.get('/professors/:id', checkAuth, (req, res) => {
  Professor.findById(req.params.id)
    .populate('department courses')
    .then(professor => res.json(professor))
    .catch(err => res.status(400).json('Error: ' + err));
});

// PUT route to update a professor by id
router.put('/professors/:id', checkAuth, (req, res) => {
  Professor.findById(req.params.id)
    .then(professor => {
      professor.personalInfo = req.body.personalInfo || professor.personalInfo;
      professor.department = req.body.department || professor.department;
      professor.courses = req.body.courses || professor.courses;
      professor.save()
        .then(() => res.json('Professor updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE route to delete a professor by id
router.delete('/professors/:id', checkAuth, (req, res) => {
  Professor.findByIdAndDelete(req.params.id)
    .then(() => res.json('Professor deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
