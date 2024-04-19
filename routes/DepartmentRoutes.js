const express = require('express');
const router = express.Router();

// Import the Department model
const Department = require('../models/Department');

// Dummy authentication service that you would replace with real authentication logic
const AuthService = {
  getUserRoleFromToken: (token) => {
    // Placeholder logic: In a real scenario, validate the token and retrieve the user's role
    // For this example, let's assume 'admin' for simplicity
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
  if (userRole !== 'admin' && userRole !== 'headOfDepartment') {
    return res.status(403).json('Unauthorized: Insufficient permissions');
  }

  // User is authenticated and authorized, continue to the next middleware
  next();
};

// GET route to fetch all departments
router.get('/departments', checkAuth, (req, res) => {
  Department.find()
    .populate('head courses')  // Assuming 'head' and 'courses' are fields in the Department model
    .then(departments => res.json(departments))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST route to create a new department
router.post('/departments', checkAuth, (req, res) => {
  const newDepartment = new Department(req.body);
  newDepartment.save()
    .then(() => res.json('Department added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to fetch a single department by id
router.get('/departments/:id', checkAuth, (req, res) => {
  Department.findById(req.params.id)
    .populate('head courses')
    .then(department => res.json(department))
    .catch(err => res.status(400).json('Error: ' + err));
});

// PUT route to update a department by id
router.put('/departments/:id', checkAuth, (req, res) => {
  Department.findById(req.params.id)
    .then(department => {
      department.name = req.body.name;
      department.head = req.body.head;
      department.faculty = req.body.faculty;
      department.courses = req.body.courses;
      department.save()
        .then(() => res.json('Department updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE route to delete a department by id
router.delete('/departments/:id', checkAuth, (req, res) => {
  Department.findByIdAndDelete(req.params.id)
    .then(() => res.json('Department deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
