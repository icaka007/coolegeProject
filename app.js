const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');  // Check this path to ensure it's correct

const app = express();

// Body-parser middleware for JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MongoDB connection URI
const dbURI = 'mongodb://localhost:27017/college_management';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Import and use routes
const departmentRoutes = require('./routes/DepartmentRoutes');
app.use(departmentRoutes);

// POST route for registration
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Route to serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Server listening on port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
