const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });

const mailClient= nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PWD
    }
});
    
const mailFrom = process.env.MAIL_USER;

mailClient.verify(function(error, success) {
    if (error) return console.log(error);
    console.log("Mail client active");
});

module.exports = { mailClient, mailFrom };