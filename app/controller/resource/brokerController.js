const loggerService = require('../../services/core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../../services/core/error-service');
const brokerService = require('../../services/resource/broker-service');

/**
 * Method that send Message
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.sendMessage = function (req, res) {
    logger.info('[brokerController] sendMessage Start');
    if (req.user.role !== env.services.roles.broker) {
        logger.info('[brokerController] sendMessage Not BRO');
        error.sendError(env.errCodes.ERR401, res);
    } else {
        brokerService.sendMessage(req.body, req.user).then(function (data) {
            logger.info('[brokerController] sendMessage Success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[brokerController] sendMessage Error', err);
            error.sendError(err, res);
        });
    }
};

/**
 * Method that find all Messages
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.getMessages = function (req, res) {
    logger.info('[brokerController] getMessages Start');
    brokerService.getMessages(req.body, req.user)
        .then(function (data) {
            logger.info('[brokerController] getMessages Success');
            res.json(data);
        }).catch(function (err) {
        logger.error('[brokerController] getMessages Error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that delete a message
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.deleteMessage = function (req, res) {
    logger.info('[brokerController] deleteMessages Start');
    if (req.user.role !== env.services.roles.admin) {
        logger.info('[brokerController] deleteMessage Not ADM');
        error.sendError(env.errCodes.ERR401, res);
    } else {
        brokerService.deleteMessage(req.params, req.user)
            .then(function (data) {
                logger.info('[brokerController] deleteMessage Success');
                res.json(data);
            }).catch(function (err) {
            logger.error('[brokerController] deleteMessage Error', err);
            error.sendError(err, res);
        });
    }
};

