const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env' });

// Init server
const app = express();
const PORT = process.env.PORT;

// CORS
app.use(cors());

// Express.json
app.use(express.json({ extended: true }));

// Import Routes
app.use('/api/v1', require('./routes/routes'));

// Starting server
app.listen(PORT, () => {console.log('Server active')});