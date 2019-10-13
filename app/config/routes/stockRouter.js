const authentication = require('../../services/core/authentication-service');
const controller = require('../../controller/index');
const express = require('express');
/**
 * Method to run routes
 */
module.exports.init = function (expressApp) {
    let router = express.Router();

    /**
     * Route that returns a stock information
     * @param {Object} req.user User token info
     * @return {Object} stock prices
     */
    router.get('/stockInfo', authentication.init, controller.stockController.getStockInfo);

    /**
     * Route that returns a stock history
     * @param {Object} req.user User token info
     * @return {Object} stock prices
     */
    router.get('/stockHistory', authentication.init, controller.stockController.getStockHistory);

    expressApp.use('/', router);
};
