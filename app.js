const express = require('express');
const { dbConnect } = require('./config/db');
const path = require('path');

const app = express();

// Make database connection
dbConnect().then(() => {
	console.log("Database connected.")
}).catch(error => {
	console.error(`Database connection error: ${error.message}`);
});

const userRoutes = require('./routes/userRoutes');
const cvRoutes = require('./routes/cvRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const homeRoutes = require('./routes/homeRoutes');

// Middleware to parse incoming requests
app.use(express.json()); // For application/json
app.use(express.urlencoded({ extended: true })); // For application/x-www-form-urlencoded


// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api', homeRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.all('*', (req, res) => {
	res.status(404).json({ message: 'Resource not found' });
});


const PORT = process.env.PORT || 5000;
const server = require('http').createServer(app);

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});

module.exports = app;