const loggerService = require('../../service/core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../core/error-service');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');

/**
 * Method that validate if the user inside token is valid or not.
 * @param req req.headers.Authenticate (Bearer token) user credentials.
 * @param res response.
 * @param next Method that lets run the next service
 */
module.exports.init = function (req, res, next) {
    logger.info('[authentication-service] Start');
    let token = req.headers['Authentication'];
    if (!token) {
        error.sendError(env.ERRCODE.ERR401, res);
    } else {
        token = token.replace('Bearer ', '');
        jwt.verify(token, env.token.PRIVATETOKEN, function (err, user) {
            if (err) {
                logger.error('[authentication-service] Invalid token');
                error.sendError(env.ERRCODE.ERR401, res);
            } else {
                User.find({username: user.username, password: user.password})
                    .exec(function (err, elem) {
                        if (err) {
                            logger.error('[authentication-service] Mongo error');
                            error.sendError(env.ERRCODE.SERVER, res);
                        } else if (!elem) {
                            logger.info('[authentication-service] User dont match');
                            error.sendError(env.ERRCODE.ERR401, res);
                        } else {
                            logger.info('[authentication-service] Success');
                            req['user'] = elem;
                            next();
                        }
                    });
            }
        });
    }
};