'use strict'

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, require: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true, trim: true, unique: true },
    document: { type: String, require: true, trim: true, unique: true },
    phone: { type: String, require: true },
    wallet: { type: mongoose.Schema.Types.ObjectId, require: true },
    password: { type: String, require: true },
    sessions: { type: Array, default: [] },
    deposits: { type: Array, default: [] },
    purchases: { type: Array, default: [] },
    deleted_at: Date,
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', UserSchema);