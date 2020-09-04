'use strict'
const { validationResult } = require('express-validator');
const { mailClient, mailFrom } = require('../config/nodemailer');
const mongoose = require('mongoose');
// Models
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Deposit = require('../models/Deposit');
const Purchase = require('../models/Purchase');

const sendMailToUser = async (user_id, subject, msg, sendAsync=false) => {
    try {
        // Get user
        let user= await User.findById(user_id);
        if (!user) return false;
        let options = { from: mailFrom, to: user.email, subject: subject, text: msg };
    
        if (!sendAsync) {
            mailClient.sendMail(options);
            return true;
        }
        let result= await mailClient.sendMail(options);
        if (!result) return false;
        return true;
    } catch (error) {
        return false;
    }
}

const createWallet = async (user_id) => {
    try {
        // Create wallet
        let wallet = new Wallet({ user: user_id, balance: 0, purchases: [], deposits: [] });
        wallet = await wallet.save();
        // Validate session
        if (!wallet) return false;
        // Update user
        let user= User.findOneAndUpdate({ _id: user_id }, { wallet: wallet._id });
        if (!user) return false;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getBalance = async (req, res) => {
    try {
        let session = req.session;
        let params = req.body;
        // Validate user data
        let user= await User.findOne({ _id: session.user, document: params.document, phone: params.phone, deleted_at: null });
        if (!user)
            return res.status(422).json({ result: 'Error', error: true, errorCode: 'badRequest' });
        let wallet = await Wallet.findOne({ user: session.user, deleted_at: null }).exec();
        // Check result
        if (!wallet)
            return res.status(404).json({ result: 'Error', error: true, errorCode: 'walletNotFind' });
        // Last touches
        res.status(200).json({ result: 'Success', balance: wallet.balance, error: false });
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
    }
}

const makePurchase = async (req, res) => {
    try {
        // Valided request
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' }); 
        
        let session = req.session;
        let params = req.body;
        // Valided balance
        let wallet= await Wallet.findOne({user: session.user, deleted_at: null});
        if (!wallet)
            return res.status(400).json({ result: 'Error', error: true, errorCode: 'walletNotFind' });
        if (wallet.balance < params.amount)
            return res.status(422).json({ result: 'Error', error: true, errorCode: 'badBalance' });
        
        // Process purchase
        let purchase = new Purchase({
            user: wallet.user, wallet: wallet._id, amount: params.amount,
            status: 'not confirm', confirmation_code: Math.floor(100000 + Math.random() * 900000)
        });
        // Save
        purchase = await purchase.save();
        if (!purchase)
            return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
        // Mail code for confirmation
        sendMailToUser(wallet.user, "Purchase confirmation code",
            "Please use this code for confirm and finish processing your purchase: "+purchase.confirmation_code);
        // Last touches
        return res.status(200).json({ result: 'Success', purchase_id: purchase._id, error: false });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
    }
}

const confirmPurchase = async (req, res) => {
    try {
        // Valided request
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' }); 
        
        let session = req.session;
        let params = req.body;
        // Process purchase
        let purchase = await Purchase.aggregate([
            { "$match": { _id: mongoose.Types.ObjectId(req.params.id), user: session.user, confirmation_code: params.code }},
            { "$lookup": {
                "from": "wallets",
                "localField": "wallet",
                "foreignField": "_id",
                "as": "userWallet"
            }}
        ]);
        if (!(purchase && purchase.length))
            return res.status(404).json({ result: 'Error', error: true, errorCode: 'purchaseNotFind' });
        purchase= purchase[0];
        let wallet= purchase.userWallet[0]
        if (purchase.amount > wallet.balance)
            return res.status(422).json({ result: 'Error', error: true, errorCode: 'badBalance' });
        // Update balance
        wallet= await Wallet.findOneAndUpdate({ _id: wallet._id },
            { balance: wallet.balance - purchase.amount }, { new: true });
        if (!wallet)
            return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
        // Confirm purchase
        purchase= await Purchase.findOneAndUpdate({ _id: purchase._id },
            { status: "success", confirmation_code: null }, { new: true });
        if (!purchase)
            return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
        // Last touches
        return res.status(200).json({ result: 'Success', error: false, purchase });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
    }
}

const makeDeposit = async (req, res) => {
    try {
        // Valided request
        const errors = validationResult(req);
        if(errors && errors.errors.length)
            return res.status(400).json({ result: 'Error', error: true, errors: errors.errors, errorCode: 'badRequest' }); 
        
        let session = req.session;
        let params = req.body;
        // Validate user data
        let user= await User.findOne({ _id: session.user, document: params.document, phone: params.phone, deleted_at: null });
        if (!user)
            return res.status(422).json({ result: 'Error', error: true, errorCode: 'badDeposit' });
        // Get wallet
        let wallet= await Wallet.findOne({user: session.user, deleted_at: null});
        if (!wallet)
            return res.status(400).json({ result: 'Error', error: true, errorCode: 'walletNotFind' });
        // Create deposit
        let deposit = new Deposit({
            user: user._id, wallet: wallet._id, amount: params.amount, status: 'fail'
        });
        deposit = await deposit.save();
        if (!deposit)
            return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
        // Update balance
        wallet= await Wallet.findOneAndUpdate({ _id: wallet._id },
            { balance: wallet.balance + deposit.amount }, { new: true });
        if (!wallet)
            return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
        // Confirm deposit
        deposit= await Deposit.findOneAndUpdate({ _id: deposit._id }, { status: "success" }, { new: true });
        if (!deposit)
            return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
        // Last touches
        return res.status(200).json({ result: 'Success', error: false, deposit });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
    }
}

const getPurchases = async (req, res) => {
    try {
        let session = req.session;
        // Get all
        let purchases= await Purchase.find({user: session.user, deleted_at: null}).sort({ created_at: -1 });
        // Last touches
        return res.status(200).json({ result: 'Success', purchases, error: false });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
    }
}

const getDeposits = async (req, res) => {
    try {
        let session = req.session;
        // Get all
        let deposits= await Deposit.find({user: session.user, deleted_at: null}).sort({ created_at: -1 });
        // Last touches
        return res.status(200).json({ result: 'Success', deposits, error: false });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
    }
}

module.exports = {
    createWallet,
    getBalance,
    makePurchase,
    confirmPurchase,
    makeDeposit,
    getPurchases,
    getDeposits
};