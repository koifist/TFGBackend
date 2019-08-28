const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const env = require('../../config/env');
const router = require('../../config/router-config');
const cors = require('cors');
const cronService = require('../resource/socket-service');
const moment = require('moment');

module.exports.init = function () {
    let app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.set('port', env.app.port);
    loggerService.init(app).then(function () {
        moment().locale('es');
        router.init(app);
        let resolver = Promise.defer();
        let server = app.listen(app.get('port'), function () {
            resolver.resolve();
            logger.info('express running at port ' + env.app.port);
        });
        let io = require('socket.io').listen(server);
        cronService.init(io);
        return resolver.promise;
    });
};
