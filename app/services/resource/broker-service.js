const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const Promise = require('bluebird');
const Broker = require('../../model/broker');


/**
 * Function to create a default inActive Broker
 * @param user
 * @returns {Promise}
 */
module.exports.createBroker = function (body, user) {
    return new Promise(function (resolve, reject) {
        Broker.create({user: user._id}).then(function (elem) {
            if (elem) {
                logger.info('[broker-services]createBroker success');
                resolve(env.errCodes.SUCCESS);
            } else {
                logger.info('[broker-services]createBroker error');
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
        Broker.findOneAndUpdate({user: user._id}, {$push: {messages: {msg: body.msg}}}, {new: true})
            .select(env.mongo.select.default)
            .exec(function (err, elem) {
                if (err) {
                    logger.info('[broker-services]sendMessage Mongo error');
                    reject(env.errCodes.SERVER);
                } else if (!elem) {
                    logger.info('[broker-services]sendMessage Broker dont exist');
                    reject(env.errCodes.ERR400);
                } else {
                    logger.info('[broker-services]sendMessage Success');
                    resolve(elem.messages);
                }
            });
    });
};

/**
 * Function to active a Broker
 * @param body._id
 * @param user
 * @returns {Promise} Session token
 */
module.exports.activeBroker = function (body, user) {
    return new Promise(function (resolve, reject) {
        Broker.findByIdAndUpdate(body._id, {active: true})
            .select(env.mongo.select.default)
            .exec(function (err, elem) {
                if (err) {
                    logger.info('[broker-services]activeBroker Mongo error');
                    reject(env.errCodes.SERVER);
                } else if (!elem) {
                    logger.info('[broker-services]activeBroker Broker dont exist');
                    reject(env.errCodes.ERR400);
                } else {
                    logger.info('[broker-services]activeBroker Success');
                    resolve(env.errCodes.SUCCESS);
                }
            });
    });
};

/**
 * Function to find active broker
 * @param body._id
 * @param user
 * @returns {Promise} Session token
 */
module.exports.findBroker = function (body, user) {
    return new Promise(function (resolve, reject) {
        Broker.findOne({_id: body._id, active: true})
            .select(env.mongo.select.default)
            .exec(function (err, elem) {
                if (err) {
                    logger.info('[broker-services]findBroker Mongo error');
                    reject(env.errCodes.SERVER);
                } else if (!elem) {
                    logger.info('[broker-services]findBroker Broker dont exist');
                    reject(env.errCodes.ERR400);
                } else {
                    logger.info('[broker-services]findBroker Success');
                    resolve(elem);
                }
            });
    });
};

/**
 * Function to get all brokers pub user active and ADM inactive
 * @param body._id
 * @param user
 * @returns {Promise} Session token
 */
module.exports.getBrokers = function (body, user) {
    return new Promise(function (resolve, reject) {
        if (user.role === 'ADM') {
            logger.info('[broker-services]getBrokers ADM');
            Broker.find({active: false})
                .select(env.mongo.select.default)
                .exec(function (err, elem) {
                    if (err) {
                        logger.info('[broker-services]getBrokers Mongo error');
                        reject(env.errCodes.SERVER);
                    } else {
                        delete elem.messages;
                        logger.info('[broker-services]getBrokers Success');
                        resolve(elem);
                    }
                });
        } else {
            logger.info('[broker-services]getBrokers PUB');
            Broker.find({active: true})
                .select(env.mongo.select.default)
                .exec(function (err, elem) {
                    if (err) {
                        logger.info('[broker-services]getBrokers Mongo error');
                        reject(env.errCodes.SERVER);
                    } else {
                        delete elem.messages;
                        logger.info('[broker-services]getBrokers Success');
                        resolve(elem);
                    }
                });
        }
    });
};
