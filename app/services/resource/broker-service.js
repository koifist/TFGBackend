const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const Promise = require('bluebird');
const Message = require('../../model/message');
const cron = require('./socket-service');


/**
 * Function to create a Broker
 * @param body.username user to made broker
 * @param user
 * @returns {Promise}
 */
module.exports.createBroker = function (body, user) {
    return new Promise(function (resolve, reject) {
        user.findOneAndUpdate({username: body.username}, {role: env.services.roles.broker}).then(function (elem) {
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
            Message.create({user: user._id}, {$push: {messages: {msg: body.msg}}}, {new: true})
                .then(function (elem) {
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
