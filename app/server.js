try {
    const expressService = require('./service/core/express-service');
    const mongooseService = require('./service/core/mongoose-service');
    mongooseService.init().then(function () {
        expressService.init();
    });
} catch (Exception) {
    console.error('================================================================================\n' + 'GENERAL ERROR API', Exception);
}