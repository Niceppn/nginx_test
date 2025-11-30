const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// load .env early
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// load model
const Age = require(path.join(__dirname, 'models', 'age'));

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express + MongoDB' });
});

// Save an age
app.post('/api/age', async (req, res) => {
	const { age } = req.body;
	if (age === undefined || age === null) {
		return res.status(400).json({ error: 'age is required' });
	}
	const numericAge = Number(age);
	if (Number.isNaN(numericAge)) {
		return res.status(400).json({ error: 'age must be a number' });
	}

	try {
		const doc = await Age.create({ age: numericAge });
		return res.json({ message: 'Saved', data: doc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
});

// Get all ages
app.get('/api/ages', async (req, res) => {
	try {
		const docs = await Age.find().sort({ createdAt: -1 }).limit(100);
		res.json({ data: docs });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
});

// start server after DB connection
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/react_nginx';

async function start() {
	try {
		console.log('Connecting to MongoDB...');
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to MongoDB');

		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	} catch (err) {
		console.error('MongoDB connection error:', err);
		// Exit the process if DB connection fails — prevents buffering/timeouts
		process.exit(1);
	}
}

start();
