const env = require('../../config/env');

/**
 * Method that send an error to client.
 * @param error
 * @param res
 */
module.exports.sendError = function (error, res) {
    if (error.status && error.msg) {
        res.status(error.status).send({error: error.msg});
    } else {
        res.status(env.ERRCODE.SERVER.status);
        res.send(env.ERRCODE.SERVER.msg);
    }
};