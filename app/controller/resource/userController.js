const loggerService = require('../../services/core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../../services/core/error-service');
const userService = require('../../services/resource/user-service');

/**
 * Method that return a token to user
 * @param req.body.username
 * @param req.body.password
 * @return {String} token to user
 */
module.exports.signIn = function (req, res) {
    logger.info('[userController] start signIn');
        userService.signIn(req.body).then(function (data) {
            logger.info('[userController] signIn success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] signIn error', err);
            error.sendError(err, res);
        });
};

/**
 * Method that create user
 * @param req.body.username
 * @param req.body.password
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
 * @param req.user
 * @param req.body.password
 * @return {status}
 */
module.exports.updatePass = function (req, res) {
    logger.info('[userController] updatePass Start');
    userService.updatePass(req.body, req.user).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        logger.error('[userController] updatePass error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that update user Role [Administrator only]
 * @param req.user
 * @param req.body.role
 * @param req.params._id
 * @return {status}
 */
module.exports.updateRole = function (req, res) {
    logger.info('[userController] updateRole Start');
    if (req.user.role !== env.services.roles.admin) {
        error.sendError(env.errCodes.ERR401, res)
    } else {
        userService.updateRole(req.body, req.user).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] updateRole error', err);
            error.sendError(err, res);
        });
    }
};

/**
 * Method that delete user
 * @param req.params._id [Administrator only]
 * @param req.user._id [All users]
 * @return {status}
 */
module.exports.deleteUser = function (req, res) {
    logger.info('[userController] deleteUser Start');
    if (req.user.role === env.services.roles.admin && req.params._id) {
        userService.deleteUser(req.params, req.user).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] deleteUser ADM error', err);
            error.sendError(err, res);
        });
    } else if (!req.params._id) {
        userService.deleteUser(req.user, req.user).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] deleteUser error', err);
            error.sendError(err, res);
        });
    } else {
        logger.error('[userController] deleteUser error', env.errCodes.ERR400);
        error.sendError(env.errCodes.ERR400, res);
    }
};
