const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../core/error-service');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');

/**
 * Method that validate if the user inside token is valid or not.
 * @param req req.headers.Authenticate (Bearer token) user credentials.
 * @param res response.
 * @param next Method that lets run the next services
 */
module.exports.init = function (req, res, next) {
    logger.info('[authentication-services] Start');
    let token = req.headers['authorization'];
    if (!token) {
        error.sendError(env.errCodes.ERR401, res);
    } else {
        token = token.replace('Bearer ', '');
        jwt.verify(token, env.security.PRIVATE_TOKEN, function (err, user) {
            if (err) {
                logger.error('[authentication-services] Invalid token');
                error.sendError(env.errCodes.ERR401, res);
            } else {
                User.findOne({username: user.username})
                    .exec(function (err, elem) {
                        if (err) {
                            logger.error('[authentication-services] Mongo error');
                            error.sendError(env.errCodes.SERVER, res);
                        } else if (!elem) {
                            logger.info('[authentication-services] User dont match');
                            error.sendError(env.errCodes.ERR401, res);
                        } else {
                            if (elem.isActive) {
                                logger.info('[authentication-services] Success user logged: ', user.username);
                                delete user.password;
                                req['user'] = elem;
                                next();
                            } else {
                                logger.info('[authentication-services] User is not active');
                                error.sendError(env.errCodes.ERR401, res);
                            }
                        }
                    });
            }
        });
    }
};