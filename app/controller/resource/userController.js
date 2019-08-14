const loggerService = require('../../services/core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../../services/core/error-service');
const userService = require('../../services/resource/user-service');

/**
 * Method that return a token to user
 * @param req.user.username
 * @param req.user.password
 * @return {String} token to user
 */
module.exports.signIn = function (req, res) {
    logger.info('[userController] start signIn');
    if (!req.body) {
        error.sendError(env.errCodes.ERR400, res);
    } else {
        userService.signIn(req.body).then(function (data) {
            logger.info('[userController] signIn success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] signIn error', err);
            error.sendError(err, res);
        });
    }
};

/**
 * Method that create user
 * @param req.user.username
 * @param req.user.password
 * @return {String} token to user
 */
module.exports.signUp = function (req, res) {
    logger.info('[userController] SignUp Start');
    userService.signUp(req.body).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        logger.error('[userController] signUp error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that update user password
 * @param req.user.username
 * @return {String} token to user
 */
module.exports.updatePass = function (req, res) {
    logger.info('[userController] updatePass Start');
    userService.updatePass(req).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        logger.error('[userController] signUp error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that update user Role
 * @param req.params._id
 * @return {String} token to user
 */
module.exports.updateRole = function (req, res) {
    logger.info('[userController] updatePass Start');
    if (req.user.role !== env.services.roles.admin) {
        error.sendError(env.errCodes.ERR401, res)
    } else {
        userService.updateRole(req).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] signUp error', err);
            error.sendError(err, res);
        });
    }
};