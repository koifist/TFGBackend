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

    /**
     * Route that delete a message
     * @param {Object} req.params Query params
     * @param {Object} req.params._id Message object id
     * @param {Object} req.user User token info
     * @return {Array} Array of messages
     */
    router.delete('/deleteMessage/:_id*', authentication.init, controller.brokerController.deleteMessage);

    expressApp.use('/', router);
};
