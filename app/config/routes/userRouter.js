const authentication = require('../../services/core/authentication-service');
const controller = require('../../controller/index');
const express = require('express');
module.exports.init = function (expressApp) {
    let router = express.Router();

    /**
     * Route that returns a token to the user.
     */
    router.post('/createSession', controller.userController.signIn);

    /**
     * Route that create a user.
     */
    router.post('/createUser', controller.userController.signUp);

    /**
     * Route that update user password.
     */
    router.post('/updatePass', authentication.init, controller.userController.updatePass);

    /**
     * Route that delete
     */
    router.delete('/deleteUser/:_id?', authentication.init, controller.userController.deleteUser);

    expressApp.use('/', router);
};
