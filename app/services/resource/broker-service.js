const moment = require('moment');
const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const Promise = require('bluebird');
const Message = require('../../model/message');
const stockService = require('./stock-service');

/**
 * Function to send a Message
 * @param body.msg Message to send
 * @param user
 * @returns {Promise} Session token
 */
module.exports.sendMessage = function (body, user) {
    return new Promise(function (resolve, reject) {
        if (!body.msg) {
            logger.error('[broker-services]sendMessage not msg');
            reject(env.errCodes.ERR400);
        } else {
            Message.create({user: user._doc._id, username: user._doc.username, msg: body.msg, date: moment()})
                .then(function (elem) {
                    elem.user = user._id;
                    stockService.sendMsg(elem);
                    resolve(env.errCodes.SUCCESS);
                }).catch(function (err) {
                logger.info('[broker-services]sendMessage Mongo error');
                reject(env.errCodes.SERVER);
            });
        }
    });
};

/**
 * Function to find all Messages
 * @returns {Promise} array of msg
 */
module.exports.getMessages = function (body, user) {
    return new Promise(function (resolve, reject) {
        Message.find({})
            .populate({path: 'user', select: 'username'})
            .then(function (elem) {
                logger.info('[broker-services]getMessages Success');
                resolve(elem);
            }).catch(function (err) {
            logger.info('[broker-services]getMessages Mongo error');
            reject(env.errCodes.SERVER);
        });
    });
};

