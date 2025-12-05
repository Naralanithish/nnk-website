const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Static serve the frontend from project root
app.use(express.static(path.join(__dirname, '..')));

const MONGODB_URI = process.env.MONGODB_URI || '';
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.warn('Continuing without DB persistence. Check your MONGODB_URI.');
    });
} else {
  console.warn('MONGODB_URI not set — contact messages will not be saved. Set MONGODB_URI in environment to enable persistence.');
}

// Simple in-memory data (keeps working even without DB)
const services = [
  { title: 'Website Development', description: 'Custom, responsive websites built with modern standards — fast, SEO friendly, and secure.', icon: '🌐' },
  { title: 'App Development', description: 'Android & iOS apps with great UX and robust backends for production-ready products.', icon: '📱' },
  { title: 'Software & Automation', description: 'Automation tools and custom software that reduce manual work and increase productivity.', icon: '⚙️' }
];

const founder = {
  name: 'Narala Nitish Kumar',
  fatherName: 'Mr.Narala Srinivasulu',
  title: 'Founder & Lead Developer',
  bio: 'Passionate software engineer with 1+ years of experience in web and mobile app development. Nithish founded NNK Software Solutions to help startups and small businesses build digital products that scale.',
  expertise: ['Web Development','Mobile Apps','Automation','System Design','UI/UX Design','Graphic Design'],
  image: 'nithish.png',
  contact: 'nnksoftwaresolutions@gmail.com',
  social: { linkedin: 'https://www.linkedin.com/in/narala-nitishkumar-22a744280/' }
};

const projects = [
  { id: 1, title: 'Simple Billing Software', description: 'Desktop billing app built for small shops to automate invoice generation.', image: 'images/project1.jpg', category: 'Desktop App' },
  { id: 2, title: 'Flipkart Scraper Automation', description: 'Web automation tool to gather product listings and price data.', image: 'images/project2.jpg', category: 'Automation' },
  { id: 3, title: 'E-Commerce Platform', description: 'Full-stack e-commerce solution with payment gateway integration.', image: 'images/project3.jpg', category: 'Web Development' },
  { id: 4, title: 'Task Management App', description: 'Mobile app for team collaboration and task tracking.', image: 'images/project4.jpg', category: 'Mobile App' }
];

// Mongoose model for contact messages (optional)
let Contact;
// Create Contact model when mongoose connection is available.
// If the DB connection fails or is not configured, Contact will remain undefined and messages are logged only.
try {
  const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  Contact = mongoose.model('Contact', contactSchema);
} catch (err) {
  console.warn('Contact model not created (no DB). Messages will be logged instead.');
}

// API routes
app.get('/api/services', (req, res) => res.json(services));
app.get('/api/founder', (req, res) => res.json(founder));
app.get('/api/projects', (req, res) => res.json(projects));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  if (Contact) {
    try {
      const c = new Contact({ name, email, message });
      await c.save();
      return res.json({ ok: true });
    } catch (err) {
      console.error('Error saving contact:', err);
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  // If no DB, just log and return success for UX
  console.log('Contact received (not saved, no DB):', { name, email, message });
  return res.json({ ok: true, warning: 'No DB configured' });
});

// Fallback: serve index.html for any other route (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
