const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const User = require('../../model/user');
const jwt = require('jsonwebtoken');


/**
 * Function to signIn user and return a token with login information
 * @param body.username
 * @param body.password
 * @returns {Promise} Session token
 */
module.exports.signIn = function (body) {
    return new Promise(function (resolve, reject) {
        if (!body.username || !body.password) {
            reject(env.errCodes.ERR400);
        } else {
            User.findOne({username: body.username, isActive: true}).exec(function (err, elem) {
                if (err) {
                    logger.info('[user-services]signIn mongo error');
                    reject(env.errCodes.SERVER);
                } else if (!elem) {
                    logger.info('[user-services]signIn user dont exist');
                    reject(env.errCodes.ERR401);
                } else {
                    logger.info('[user-services]signIn user found');
                    bcrypt.compare(body.password, elem.password).then(function (res) {
                        if (res) {
                            logger.info('[user-services]signIn bcrypt pass match');
                            jwt.sign({
                                username: body.username
                            }, env.security.PRIVATE_TOKEN, {expiresIn: env.security.TTL_TOKEN}, function (err, token) {
                                if (err) {
                                    logger.info('[user-services]signIn jwt error');
                                    reject(env.errCodes.SERVER);
                                } else {
                                    delete elem.password;
                                    logger.info('[user-services]signIn jwt succes', token);
                                    resolve({token: token, currentUser: elem});
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
 * @param body.username
 * @param body.password
 * @returns {Promise} Session token
 */
module.exports.signUp = function (body) {
    return new Promise(function (resolve, reject) {
        if (!body.username || !body.password) {
            reject(env.errCodes.ERR400);
        } else {
            bcrypt.hash(body.password, env.security.ROUND_BCRYPT).then(function (hash) {
                logger.info('[user-services]signUp bcrypt hash success');
                User.create({username: body.username, password: hash})
                    .then(function (data) {
                        logger.info('[user-services]signUp mongo success');
                    jwt.sign({
                        username: body.username
                    }, env.security.PRIVATE_TOKEN, {expiresIn: env.security.TTL_TOKEN}, function (err, token) {
                        if (err) {
                            logger.info('[user-services]signIn jwt error');
                            reject(env.errCodes.SERVER);
                        } else {
                            delete data.password;
                            logger.info('[user-services]signIn jwt succes', token);
                            resolve({token: token, currentUser: data});
                        }
                    });
                }).catch(function (err) {
                    logger.info('[user-services]signUp mongo error');
                    reject(env.errCodes.ERR400);
                });
            }).catch(function (err) {
                logger.info('[user-services]signUp bcrypt hash error');
                reject(env.errCodes.SERVER);
            });
        }
    });
};

/**
 * Function to update password of user
 * @param user
 * @param body.password
 * @returns {Promise}
 */
module.exports.updatePass = function (body, user) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(body.password, env.security.ROUND_BCRYPT).then(function (hash) {
            logger.info('[user-services]signUp bcrypt hash success');
            User.findByIdAndUpdate(user._id, {password: hash})
                .exec(function (err, data) {
                    if (err) {
                        logger.info('[userService] updatePass error');
                        reject(env.errCodes.SERVER);
                    } else {
                        logger.info('[userService] updatePass success');
                        resolve(env.errCodes.SUCCESS);
                    }
                });
        }).catch(function (err) {
            logger.info('[user-services]signUp bcrypt hash error');
            reject(env.errCodes.SERVER);
        });
    });
};

/**
 * Function to update user role
 * @param user
 * @param body.role
 * @returns {Promise}
 */
module.exports.updateRole = function (body, user) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({username: body.username}, {role: body.role})
            .exec(function (err, data) {
                if (err) {
                    logger.info('[userService] updateRole error');
                    reject(env.errCodes.SERVER);
                } else {
                    logger.info('[userService] updateRole success');
                    resolve(env.errCodes.SUCCESS);
                }
            });
    });
};

/**
 * Function to delete user
 * @param body._id
 * @returns {Promise}
 */
module.exports.deleteUser = function (body, user) {
    return new Promise(function (resolve, reject) {
        User.findByIdAndUpdate(body._id, {active: false})
            .exec(function (err, data) {
                if (err) {
                    logger.info('[userService] deleteUser error');
                    reject(env.errCodes.SERVER);
                } else {
                    logger.info('[userService] deleteUser success');
                    resolve(env.errCodes.SUCCESS);
                }
            });
    });
};
