const express = require('express');
const router = express.Router();
// Controllers
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');
const walletController = require('../controllers/walletController');
// Helpers
const { validatons } = require('../helpers/validationHelper');
// Middlewares
const { checkAuth } = require('../middlewares/auth');

// Users
router.post('/register', 
    [ validatons.name, validatons.lastname, validatons.email, validatons.document, validatons.phone, validatons.password, validatons.confirmedPassword ],
    userController.create
);
router.post('/login', [ validatons.email, validatons.password ], userController.login);
router.get('/logout', sessionController.logout);
router.get('/session/check', checkAuth, sessionController.check);
// Pruchases
router.get('/purchases', checkAuth, walletController.getPurchases);
router.post('/purchase', checkAuth, [ validatons.amount ], walletController.makePurchase);
router.post('/purchase/:id/confirm', checkAuth, [ validatons.purchaseCode ], walletController.confirmPurchase);
// Deposits
router.get('/deposits', checkAuth, walletController.getDeposits);
router.post('/deposit', checkAuth, [ validatons.amount, validatons.document, validatons.phone ], 
    walletController.makeDeposit
);
// Balance
router.post('/balance', checkAuth, [ validatons.document, validatons.phone ], walletController.getBalance);

module.exports = router;