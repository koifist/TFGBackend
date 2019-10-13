const env = require('../../config/env');
const request = require('request');
const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const moment = require('moment-timezone');
const _ = require('lodash');
let socket;

/**
 * Function to get stock information
 * @returns {Object} Stock information
 */
module.exports.getStockPrice = function () {
    return new Promise(function (resolve, reject) {
        request(env.services.stock.stockCurrentPrices, function (error, response, body) {
            if (error) {
                logger.error('[SocketService] getStockPrice Stock error: ', error);
                reject(error);
            } else if (response && response.statusCode === 200) {
                body = JSON.parse(body);
                let company = {
                    apple: {
                        current: body.data[0].price,
                        past: body.data[0].close_yesterday
                    },
                    amazon: {
                        current: body.data[1].price,
                        past: body.data[1].close_yesterday
                    },
                    google: {
                        current: body.data[2].price,
                        past: body.data[2].close_yesterday
                    },
                    microsoft: {
                        current: body.data[3].price,
                        past: body.data[3].close_yesterday
                    }
                };
                resolve({prices: company});
            } else {
                logger.error('[SocketService] getStockPrice estatusError: ', response.status);
                reject(env.errCodes.SERVER);
            }
        });
    });
};

/**
 * Function to get stock history
 * @returns {Object} Stock information
 */
module.exports.getStockHistory = function () {
    return new Promise(function (resolve, reject) {
        let data = {
            amazon: [],
            google: [],
            apple: [],
            microsoft: []
        };
        new Promise(function (ful) {
            request(env.services.stock.historyAmazon, (error, response, body) => {
                if (error) {
                    logger.error('[SocketService] getStockHistory Stock error: ', error);
                    reject(error);
                } else if (response && response.statusCode === 200) {
                    body = JSON.parse(body);
                    _.forIn(body.intraday, function (value, key) {
                        let date = moment.tz(key, body.timezone_name).format();
                        date = moment(date).tz('Europe/Madrid').format('HH:mm:ss');
                        let stock = {
                            price: value.close,
                            time: date
                        };
                        data.amazon.push(stock);
                    });
                    ful();
                } else {
                    logger.error('[SocketService] getStockHistory Stock estatusError: ', response.status);
                    reject();
                }
            });
        }).then(function () {
            return new Promise(function (ful) {
                request(env.services.stock.historyGoogle, (error, response, body) => {
                    if (error) {
                        logger.error('[SocketService] getStockHistory Stock error: ', error);
                        reject(error);
                    } else if (response && response.statusCode === 200) {
                        body = JSON.parse(body);
                        _.forIn(body.intraday, function (value, key) {
                            let date = moment.tz(key, body.timezone_name).format();
                            date = moment(date).tz('Europe/Madrid').format('HH:mm:ss');
                            let stock = {
                                price: value.close,
                                time: date
                            };
                            data.google.push(stock);
                        });
                        ful();
                    } else {
                        logger.error('[SocketService] getStockHistory Stock estatusError: ', response.status);
                        reject();
                    }
                });
            });
        }).then(function () {
            return new Promise(function (ful) {
                request(env.services.stock.historyApple, (error, response, body) => {
                    if (error) {
                        logger.error('[SocketService] getStockHistory Stock error: ', error);
                        reject(error);
                    } else if (response && response.statusCode === 200) {
                        body = JSON.parse(body);
                        _.forIn(body.intraday, function (value, key) {
                            let date = moment.tz(key, body.timezone_name).format();
                            date = moment(date).tz('Europe/Madrid').format('HH:mm:ss');
                            let stock = {
                                price: value.close,
                                time: date
                            };
                            data.apple.push(stock);
                        });
                        ful();
                    } else {
                        logger.error('[SocketService] getStockHistory Stock estatusError: ', response.status);
                        reject();
                    }
                });
            });
        }).then(function () {
            request(env.services.stock.historyMicrosoft, (error, response, body) => {
                if (error) {
                    logger.error('[SocketService] getStockHistory Stock error: ', error);
                    reject(error);
                } else if (response && response.statusCode === 200) {
                    body = JSON.parse(body);
                    _.forIn(body.intraday, function (value, key) {
                        let date = moment.tz(key, body.timezone_name).format();
                        date = moment(date).tz('Europe/Madrid').format('HH:mm:ss');
                        let stock = {
                            price: value.close,
                            time: date
                        };
                        data.microsoft.push(stock);
                    });
                    exports.getStockPrice().then(function (prices) {
                        data.prices = prices.prices;
                        resolve(data);
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    logger.error('[SocketService] getStockHistory Stock estatusError: ', response.status);
                    reject();
                }
            });
        }).catch(function (err) {
            logger.info('[user-services]getStockHistory error', err);
            reject(env.errCodes.SERVER);
        });
    });
};
