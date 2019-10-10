const env = require('../../config/env');
var request = require('request');
const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
let socket;

/**
 * Function that start socket connection and execute stocks send
 * @param {Object} io socket object
 */
module.exports.init = function (io) {
    socket = io;
    io.on('connection', function () {
    });
    setInterval(function () {
        request(env.services.stock.url, function (error, response, body) {
            if (error) {
                logger.error('[SocketService] Socket emit Stock error: ', error);
            } else if (response && response.statusCode === 200) {
                body = JSON.parse(body);
                let company = {
                    apple: {
                        price: body.data[0].price
                    },
                    amazon: {
                        price: body.data[1].price
                    },
                    google: {
                        price: body.data[2].price
                    },
                    microsoft: {
                        price: body.data[3].price
                    }
                };
                logger.info(JSON.stringify(company));
                socket.emit('stock', JSON.stringify(company));
            } else {
                logger.error('[SocketService] Socket emit Stock statusError: ', response.statusCode);
            }
        });
    }, 10000);
};
/**
 * Function to get stock information
 * @returns {Object} Stock information
 */
module.exports.getStockPrice = function () {
    return new Promise(function (resolve, reject) {
        request(env.services.stock.url, function (error, response, body) {
            if (error) {
                logger.error('[SocketService] Service Stock error: ', error);
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
                resolve(company);
            } else {
                logger.error('[SocketService] Service Stock estatusError: ', resposne.status);
                reject();
            }
        });
    }).catch(function (err) {
        logger.info('[user-services]signUp bcrypt hash error');
        reject(env.errCodes.SERVER);
    });
};

/**
 * Function that send a msg into socket
 * @param {String } msg
 */
module.exports.sendMsg = function (msg) {
    socket.emit('messages', JSON.stringify(msg));
};
