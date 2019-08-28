const moment = require('moment');
const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const Promise = require('bluebird');
const Message = require('../../model/message');
const cron = require('./socket-service');
const User = require('../../model/user');


/**
 * Function to create a Broker
 * @param body.username user to made broker
 * @param user
 * @returns {Promise}
 */
module.exports.createBroker = function (body, user) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({username: body.username}, {role: env.services.roles.broker})
            .then(function (elem) {
                if (elem) {
                    logger.info('[broker-services]createBroker success');
                    resolve(env.errCodes.SUCCESS);
                } else if (!elem) {
                    logger.info('[broker-services]createBroker user dont exist');
                    reject(env.errCodes.ERR400);
                } else {
                    logger.error('[broker-services]createBroker error');
                    reject(env.errCodes.SERVER);
                }
            }).catch(function (err) {
            logger.info('[broker-services]createBroker Mongo error');
            reject(env.errCodes.SERVER);

        });
    });
};

/**
 * Function to send a Message
 * @param body.msg
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
                    logger.info('[broker-services]sendMessage Success');
                    cron.sendMsg(elem);
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

