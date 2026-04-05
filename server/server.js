const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/letsbefriends';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
     console.log('MongoDB connection error (Check if MongoDB is running locally):', err.message);
     console.log('API will use fallback mock data if DB continues to fail.');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
