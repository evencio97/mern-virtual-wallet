'use strict'
const { validationResult } = require('express-validator');
const { axiosClient } = require('../config/axios');

const register = async (req, res) => {
    try {
        // Valided request 
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' });
        // Redirect request
        let response= await axiosClient.post("/register", req.body, { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

const login = async (req, res) => {
    try {
        // Valided request 
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' });
        // Redirect request
        let response= await axiosClient.post("/login", req.body, { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

const logout = async (req, res) => {
    try {
        // Redirect request
        let response= await axiosClient.get("/logout", { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

const checkSession = async (req, res) => {
    try {
        // Redirect request
        let response= await axiosClient.get("/session/check", { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

module.exports = {
    register,
    login,
    logout,
    checkSession
};