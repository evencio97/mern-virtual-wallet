const express = require('express');
const router = express.Router();
// Controllers
const walletController = require('../controllers/walletController');
const userController = require('../controllers/userController');
// Helpers
const { validatons } = require('../helpers/validationHelper');

// Users
router.post('/register', 
    [ validatons.name, validatons.lastname, validatons.email, validatons.document, validatons.phone, validatons.password, validatons.confirmedPassword ],
    userController.register
);
router.post('/login', [ validatons.email, validatons.password ], userController.login);
router.get('/logout', userController.logout);
router.get('/session/check', userController.checkSession);
// Pruchases
router.get('/purchases', walletController.getPurchases);
router.post('/purchase', [ validatons.amount ], walletController.makePurchase);
router.post('/purchase/:id/confirm', [ validatons.purchaseCode ], walletController.confirmPurchase);
// Deposits
router.get('/deposits', walletController.getDeposits);
router.post('/deposit', [ validatons.amount, validatons.document, validatons.phone ], walletController.makeDeposit);

module.exports = router;