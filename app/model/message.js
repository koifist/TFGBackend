const extendSchema = require('mongoose-extend-schema');
const commonModel = require('./commonModel');
const mongooseService = require('../services/core/mongoose-service');
const mongoose = require('mongoose');

const messageSchema = extendSchema(commonModel.schema, {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    msg: {
            type: String
    },
    date: {
        type: Date,
        default: new Date
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
module.exports = mongooseService.newModel('Message', messageSchema);
