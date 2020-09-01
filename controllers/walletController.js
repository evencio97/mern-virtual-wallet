'use strict'
const { validationResult } = require('express-validator');
const { axiosClient } = require('../config/axios');

const makePurchase = async (req, res) => {
    try {
        // Valided request 
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' });
        // Redirect request
        let response= await axiosClient.post("/purchase", req.body, { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

const confirmPurchase = async (req, res) => {
    try {
        // Valided request 
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' });
        // Redirect request
        let id = req.params.id;
        let response= await axiosClient.post("/purchase/"+id+"/confirm", req.body, { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

const getPurchases = async (req, res) => {
    try {
        // Redirect request
        let response= await axiosClient.get("/purchases", { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

const makeDeposit = async (req, res) => {
    try {
        // Valided request 
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' });
        // Redirect request
        let response= await axiosClient.post("/deposit", req.body, { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

const getDeposits = async (req, res) => {
    try {
        // Redirect request
        let response= await axiosClient.get("/deposits", { headers: req.headers });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', message: 'An error has occurred, please try again later.', 
            error: true, errorCode: 'serverError' });
    }
}

module.exports = {
    makePurchase,
    confirmPurchase,
    getPurchases,
    makeDeposit,
    getDeposits
};