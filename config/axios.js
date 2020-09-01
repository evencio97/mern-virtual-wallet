const axios = require('axios');
require('dotenv').config({ path: '.env' });

const axiosClient= axios.create({
    baseURL: process.env.API_URI
})
const headers = { 'Content-Type': 'application/json' };

module.exports = { axiosClient, headers };