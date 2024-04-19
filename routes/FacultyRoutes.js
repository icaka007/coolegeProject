const express = require('express');
const router = express.Router();

// Import the Faculty model
const Faculty = require('../models/Faculty');

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
  if (userRole !== 'admin') {
    return res.status(403).json('Unauthorized: Insufficient permissions');
  }

  // User is authenticated and authorized, continue to the next middleware
  next();
};

// GET route to fetch all faculties
router.get('/faculties', checkAuth, (req, res) => {
  Faculty.find()
    .populate('dean departments')  // Assuming 'dean' and 'departments' are fields in the Faculty model
    .then(faculties => res.json(faculties))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST route to create a new faculty
router.post('/faculties', checkAuth, (req, res) => {
  const newFaculty = new Faculty(req.body);
  newFaculty.save()
    .then(() => res.json('Faculty added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to fetch a single faculty by id
router.get('/faculties/:id', checkAuth, (req, res) => {
  Faculty.findById(req.params.id)
    .populate('dean departments')
    .then(faculty => res.json(faculty))
    .catch(err => res.status(400).json('Error: ' + err));
});

// PUT route to update a faculty by id
router.put('/faculties/:id', checkAuth, (req, res) => {
  Faculty.findById(req.params.id)
    .then(faculty => {
      faculty.name = req.body.name;
      faculty.dean = req.body.dean;
      faculty.departments = req.body.departments;
      faculty.save()
        .then(() => res.json('Faculty updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE route to delete a faculty by id
router.delete('/faculties/:id', checkAuth, (req, res) => {
  Faculty.findByIdAndDelete(req.params.id)
    .then(() => res.json('Faculty deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
