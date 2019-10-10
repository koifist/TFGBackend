const express = require('express');
const routers = require('./routes');

module.exports.init = function (expressApp) {
    let router = express.Router();
    routers.userRouter.init(expressApp);
    routers.brokerRouter.init(expressApp);
    routers.stockRouter.init(expressApp);
    expressApp.use('/', router);
};
