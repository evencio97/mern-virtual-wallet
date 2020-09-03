'use strict'

const mongoose = require('mongoose');

const PurchaseSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    wallet: { type: mongoose.Schema.Types.ObjectId, require: true },
    amount: { type: Number, require: true },
    status: { type: String, require: true, default: "not confirm" },
    confirmation_code: { type: String, require: true },
    deleted_at: Date,
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);