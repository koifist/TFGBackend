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
    if (req.user.role !== 'BRO') {
        logger.info('[brokerController] activeBroker Not ADM');
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
            logger.info('[brokerController] sendMessage Success');
            res.json(data);
        }).catch(function (err) {
        logger.error('[brokerController] sendMessage Error', err);
            error.sendError(err, res);
        });
};

