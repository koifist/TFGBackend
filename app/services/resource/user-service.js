const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const User = require('../../model/user');
const jwt = require('jsonwebtoken');


/**
 * Function to signIn user and return a token with login information
 * @param body [username: data, password: data]
 * @returns {Promise} token
 */
module.exports.signIn = function (body) {
    return new Promise(function (resolve, reject) {
        if (!body.username || !body.password) {
            reject(env.errCodes.ERR400);
        } else {
            User.findOne({username: body.username}).exec(function (err, elem) {
                if (err) {
                    logger.error('[user-services]signIn mongo error', err);
                    reject(env.errCodes.SERVER);
                } else if (!elem) {
                    logger.info('[user-services]signIn user dont exist');
                    reject(env.errCodes.ERR400);
                } else {
                    logger.info('[user-services]signIn user found');
                    bcrypt.compare(body.password, elem.password).then(function (res) {
                        if (res) {
                            logger.info('[user-services]signIn bcrypt pass match');
                            jwt.sign({
                                username: body.username
                            }, env.security.PRIVATE_TOKEN, {expiresIn: env.security.TTL_TOKEN}, function (err, token) {
                                if (err) {
                                    logger.error('[user-services]signIn jwt error');
                                    reject(env.errCodes.SERVER);
                                } else {
                                    logger.info('[user-services]signIn jwt succes', token);
                                    resolve({token: token});
                                }
                            });
                        } else {
                            logger.info('[user-services]signIn bcrypt pass dont match');
                            reject(env.errCodes.ERR401);
                        }
                    });

                }
            });
        }
    });
};

/**
 * Function to signUp user. Store in database and return a token.
 * @param body [username: data, password: data, email: data]
 * @returns {Promise} token
 */
module.exports.signUp = function (body) {
    return new Promise(function (resolve, reject) {
        if (!body.username || !body.password) {
            reject(env.errCodes.ERR400);
        } else {
            bcrypt.hash(body.password, env.security.ROUND_BCRYPT).then(function (hash) {
                logger.info('[user-services]signUp bcrypt hash success');
                User.create({username: body.username, password: hash})
                    .then(function () {
                        logger.info('[user-services]signUp mongo success');
                    jwt.sign({
                        username: body.username
                    }, env.security.PRIVATE_TOKEN, {expiresIn: env.security.TTL_TOKEN}, function (err, token) {
                        if (err) {
                            logger.error('[user-services]signIn jwt error');
                            reject(env.errCodes.SERVER);
                        } else {
                            logger.info('[user-services]signIn jwt succes', token);
                            resolve({token: token});
                        }
                    });
                }).catch(function (err) {
                    logger.error('[user-services]signUp mongo error', err);
                    reject(env.errCodes.ERR400);
                });
            }).catch(function (err) {
                logger.error('[user-services]signUp bcrypt hash error', err);
                reject(env.errCodes.SERVER);
            });
        }
    });
};

/**
 * Function to update password of user
 * @param req [user body.password]
 * @returns {Promise}
 */
module.exports.updatePass = function (req) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(req.body.password, env.security.ROUND_BCRYPT).then(function (hash) {
            logger.info('[user-services]signUp bcrypt hash success');
            User.findByIdAndUpdate(req.user._id, {password: hash})
                .exec(function (err, data) {
                    if (err) {
                        logger.error('[userService] updatePass error', err);
                        reject(env.errCodes.SERVER);
                    } else {
                        logger.info('[userService] updatePass success');
                        resolve(env.errCodes.SUCCESS);
                    }
                });
        }).catch(function (err) {
            logger.error('[user-services]signUp bcrypt hash error', err);
            reject(env.errCodes.SERVER);
        });
    });
};

/**
 * Function to update user role
 * @param req [user body.password]
 * @returns {Promise}
 */
module.exports.updateRole = function (req) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({username: req.body.username}, {role: req.body.role})
            .exec(function (err, data) {
                if (err) {
                    logger.error('[userService] updateRole error', err);
                    reject(env.errCodes.SERVER);
                } else {
                    logger.info('[userService] updateRole success');
                    resolve(env.errCodes.SUCCESS);
                }
            });
    });
};