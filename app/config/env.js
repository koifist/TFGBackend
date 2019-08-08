module.exports = {
    token: {
        PRIVATETOKEN: "MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0F"
    },
    app: {
        port: 3000,
        url: 'http://localhost:3000',
        defaultDateFormat: ['DD/MM/YYYY', 'DD/MM/YY', 'YYYY-MM-DD']
    },
    service: {
        roles: {
            admin: 'ADM',
            broker: 'BRO',
            public: 'PUB'
        },
    },
    logger: {
        levelConsole: 'debug',
        levelFile: 'info',
        fileName: '%DATE%_Logger.log'
    },
    mongo: {
        url: 'mongodb://localhost/tfg',
        select: {
            default: '-v -createdAt -updatedAt'
        }
    },
    ERRCODE: {
        SUCCESS: {status: 200, msg: 'OK'},
        SERVER: {status: 500, msg: 'Internal server error'},
        ERR400: {status: 400, msg: 'Bad request'},
        ERR401: {status: 401, msg: 'Unauthorized'}
    }
};