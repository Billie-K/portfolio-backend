const express = require('express');
const { dbConnect } = require('./config/db');

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

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.all('*', (req, res) => {
	res.status(404).json({ message: 'Resource not found' });
});


const PORT = process.env.PORT || 5000;
const server = require('http').createServer(app);

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});

module.exports = app;