const extendSchema = require('mongoose-extend-schema');
const commonModel = require('./commonModel');
const mongooseService = require('../services/core/mongoose-service');
const env = require('../config/env');

const userSchema = extendSchema(commonModel.schema, {
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: env.services.roles.public
    },
    active: {
        type: Boolean,
        default: true
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
userSchema.virtual('isBroker').get(function () {
    return (this.role === 'BRO');
});
module.exports = mongooseService.newModel('User', userSchema);
