'use strict'

const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    balance: { type: Number, require: true, default: 0 },
    deposits: { type: Array, default: [] },
    purchases: { type: Array, default: [] },
    deleted_at: Date,
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Wallet', WalletSchema);