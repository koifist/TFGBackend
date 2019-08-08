const loggerService = require('../../service/core/logger-service');
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
    logger.info('[User-service]signIn Start');
    return new Promise(function (resolve, reject) {
        if (!body.username || !body.password) {
            reject(env.ERRCODE.ERR400);
        } else {
            User.findOne({username: body.username}).exec(function (err, elem) {
                if (err) {
                    logger.error('[user-service]signIn mongo error', err);
                    reject(env.ERRCODE.SERVER);
                } else if (!elem) {
                    logger.info('[user-service]signIn user dont exist');
                    reject(env.ERRCODE.ERR400);
                } else {
                    logger.info('[user-service]signIn user found');
                    bcrypt.compare(body.password, elem.password).then(function (res) {
                        if (res) {
                            logger.info('[user-service]signIn bcrypt pass match');
                            jwt.sign({
                                username: body.username,
                                password: body.password
                            }, env.token.PRIVATETOKEN, {expiresIn: "3h"}, function (err, token) {
                                if (err) {
                                    logger.error('[user-service]signIn jwt error');
                                    reject(env.ERRCODE.SERVER);
                                } else {
                                    logger.info('[user-service]signIn jwt succes', token);
                                    resolve({token: token});
                                }
                            });
                        } else {
                            logger.info('[user-service]signIn bcrypt pass dont match');
                            reject(env.ERRCODE.ERR401);
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
    logger.info('[User-service]signUp Start');
    return new Promise(function (resolve, reject) {
        if (!body.username || !body.password || !body.email) {
            reject(env.ERRCODE.ERR400);
        } else {
            bcrypt.hash(body.password, 10).then(function (hash) {
                logger.info('[user-service]signUp bcrypt hash success');
                User.create({username: body.username, password: hash, email: body.email}).then(function () {
                    logger.info('[user-service]signUp mongo success');
                    jwt.sign({
                        username: body.username,
                        password: body.password
                    }, env.token.PRIVATETOKEN, {expiresIn: "3h"}, function (err, token) {
                        if (err) {
                            logger.error('[user-service]signIn jwt error');
                            reject(env.ERRCODE.SERVER);
                        } else {
                            logger.info('[user-service]signIn jwt succes', token);
                            resolve({token: token});
                        }
                    });
                }).catch(function (err) {
                    logger.error('[user-service]signUp mongo error', err);
                    reject(env.ERRCODE.ERR400);
                });
            }).catch(function (err) {
                logger.error('[user-service]signUp bcrypt hash error', err);
                reject(env.ERRCODE.SERVER);
            });
        }
    });
};