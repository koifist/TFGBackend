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
     * @return {Object} Socket information
     */
    router.get('/stockInfo', authentication.init, controller.stockController.getStockInfo);

    expressApp.use('/', router);
};
