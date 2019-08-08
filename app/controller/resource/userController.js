const loggerService = require('../../service/core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../../service/core/error-service');
const userService = require('../../service/resource/user-service');

/**Method that create a sesion to user
 * @param req.user.username
 * @param req.user.password
 * @return {String} token to user
 */
module.exports.signIn = function (req, res) {
    logger.info('[userController] start signIn');
    if (!req.body) {
        error.sendError(env.ERRCODE.ERR400, res);
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

/**Method that create user
 * @param req.user.username
 * @param req.user.password
 * @param req.user.email
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

/**Method that create a sesion to user
 * @param req.user.username
 * @param req.user.password
 * @return {String} token to user
 */
module.exports.updateUser = function (req, res) {

};