const loggerService = require('../core/logger-service');
let logger = loggerService.getLogger();
const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const env = require('../../config/env');
const router = require('../../config/router-config');
var cors = require('cors');


module.exports.init = function () {
    let app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors());
    app.set('port', env.app.port);
    loggerService.init(app).then(function () {
        router.init(app);
        let resolver = Promise.defer();

        app.listen(app.get('port'), function () {
            resolver.resolve();
            logger.info('express running at port ' + env.app.port);
        });

        return resolver.promise;
    });
};