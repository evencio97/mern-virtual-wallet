'use strict'

const mongoose = require('mongoose');

const DepositSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    wallet: { type: mongoose.Schema.Types.ObjectId, require: true },
    amount: { type: Number, require: true },
    status: { type: String, require: true, default: "processing" },
    deleted_at: Date,
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Deposit', DepositSchema);