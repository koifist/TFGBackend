const extendSchema = require('mongoose-extend-schema');
const commonModel = require('./commonModel');
const mongooseService = require('../services/core/mongoose-service');
const mongoose = require('mongoose');

const subscriptionSchema = extendSchema(commonModel.schema, {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker',
        required: true,
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
module.exports = mongooseService.newModel('Subscription', subscriptionSchema);
