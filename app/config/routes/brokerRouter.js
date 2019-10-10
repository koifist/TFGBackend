const authentication = require('../../services/core/authentication-service');
const controller = require('../../controller/index');
const express = require('express');
/**
 * Method to run routes
 */
module.exports.init = function (expressApp) {
    let router = express.Router();

    /**
     * Route that send message.
     * @param {String} req.body.message Message to send
     * @param {Object} req.user User token info
     * @return {status} Response status
     */
    router.post('/sendMessage', authentication.init, controller.brokerController.sendMessage);

    /**
     * Route that get all messages.
     * @param {Object} req.user User token info
     * @return {Array} Array of messages
     */
    router.get('/getMessages', authentication.init, controller.brokerController.getMessages);

    expressApp.use('/', router);
};
