const loggerService = require('../../services/core/logger-service');
let logger = loggerService.getLogger();
const error = require('../../services/core/error-service');
const stockService = require('../../services/resource/stock-service');

/**
 * Method that get stock info
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.getStockInfo = function (req, res) {
    logger.info('[stockController] getStockInfo Start');
    stockService.getStockPrice().then(function (data) {
        logger.info('[stockController] getStockInfo Success');
        res.json(data);
    }).catch(function (err) {
        logger.error('[stockController] getStockInfo Error', err);
        error.sendError(err, res);
    });
};
