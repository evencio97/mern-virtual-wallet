const { check } = require('express-validator');

const validatons = {
    name: check('name', 'The name is required').isString(),
    lastname: check('lastname', 'The lastname is required').isString(),
    document: check('document', 'The document is required').isString(),
    phone: check('phone', 'The phone is required').isString(),
    email: check('email', 'The email is required').isEmail(),
    password: check('password', 'The password is missing or is invalid').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/),
    confirmedPassword: check('confirmedPassword', 'The password confirmation is required').isString(),
    purchaseCode: check('code', 'The confirmation code is required').isString(),
    amount: check('name', 'The name is required').isNumeric().custom((value) => value > 0)
};

module.exports = {
    validatons
};