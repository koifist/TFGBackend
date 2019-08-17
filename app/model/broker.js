const extendSchema = require('mongoose-extend-schema');
const commonModel = require('./commonModel');
const mongooseService = require('../services/core/mongoose-service');
const mongoose = require('mongoose');

const brokerSchema = extendSchema(commonModel.schema, {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    messages: [{
        msg: {
            type: String
        },
        date: {
            type: Date,
            default: new Date
        }
    }]
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
module.exports = mongooseService.newModel('Broker', brokerSchema);
