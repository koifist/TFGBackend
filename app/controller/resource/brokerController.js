const loggerService = require('../../services/core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../../services/core/error-service');
const brokerService = require('../../services/resource/broker-service');

/**
 * Method that create broker
 * @param req.user
 * @return {status}
 */
module.exports.createBroker = function (req, res) {
    logger.info('[brokerController] createBroker Start');
    brokerService.createBroker(req.body, req.user).then(function (data) {
        logger.info('[brokerController] createBroker Success');
        res.json(data);
    }).catch(function (err) {
        logger.error('[brokerController] createBroker Error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that send Message
 * @param req.user
 *  @param req.body.message
 * @return {status}
 */
module.exports.sendMessage = function (req, res) {
    logger.info('[brokerController] sendMessage Start');
    brokerService.sendMessage(req.body, req.user).then(function (data) {
        logger.info('[brokerController] sendMessage Success');
        res.json(data);
    }).catch(function (err) {
        logger.error('[brokerController] sendMessage Error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that active Broker
 * @param req.user
 * @param req.params._id
 * @return {status}
 */
module.exports.activeBroker = function (req, res) {
    logger.info('[brokerController] activeBroker Start');
    if (req.user.role !== 'ADM') {
        logger.info('[brokerController] activeBroker Not ADM');
        error.sendError(env.errCodes.ERR401, res);
    } else {
        brokerService.activeBroker(req.params, req.user).then(function (data) {
            logger.info('[brokerController] activeBroker Success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[brokerController] activeBroker Error', err);
            error.sendError(err, res);
        });
    }
};

/**
 * Method that return one broker or all
 * @param req.user
 * @param req.params._id
 * @return {status}
 */
module.exports.getBrokers = function (req, res) {
    logger.info('[brokerController] getBrokers Start');
    if (req.params._id) {
        brokerService.findBroker(req.params, req.user).then(function (data) {
            logger.info('[brokerController] getBrokers Success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[brokerController] getBrokers Error', err);
            error.sendError(err, res);
        });
    } else {
        brokerService.getBrokers(req.params, req.user).then(function (data) {
            logger.info('[brokerController] getBrokers Success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[brokerController] getBrokers Error', err);
            error.sendError(err, res);
        });
    }
};