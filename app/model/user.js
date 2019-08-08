const extendSchema = require('mongoose-extend-schema');
const commonModel = require('./commonModel');
const mongooseService = require('../service/core/mongoose-service');

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
        default: 'PUB'
    },
    email: {
        type: String,
        required: true
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
module.exports = mongooseService.newModel('User', userSchema);
