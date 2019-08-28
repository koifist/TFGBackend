const authentication = require('../../services/core/authentication-service');
const controller = require('../../controller/index');
const express = require('express');
module.exports.init = function (expressApp) {
    let router = express.Router();

    /**
     * Route that create a broker.
     */
    router.post('/createBroker', authentication.init, controller.brokerController.createBroker);

    /**
     * Route that send message.
     */
    router.post('/sendMessage', authentication.init, controller.brokerController.sendMessage);

    /**
     * Route that get all messages.
     */
    router.get('/getMessages', authentication.init, controller.brokerController.getMessages);

    expressApp.use('/', router);
};
