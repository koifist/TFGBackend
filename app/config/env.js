module.exports = {
    security: {
        ROUND_BCRYPT: 10,
        PRIVATE_TOKEN: 'MIicXAibAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0F',
        TTL_TOKEN: '3h'
    },
    app: {
        port: 3000,
        url: 'http://localhost:3000'
    },
    services: {
        roles: {
            admin: 'ADM',
            broker: 'BRO',
            public: 'PUB'
        },
        company: [{name: 'Google', price: '1153,58'}, {name: 'Amazon', price: '1749,62'}, {
            name: 'Apple',
            price: '1202,64'
        }]
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
    errCodes: {
        SUCCESS: {status: 200, msg: 'OK'},
        SERVER: {status: 500, msg: 'Internal server error'},
        ERR400: {status: 400, msg: 'Bad request'},
        ERR401: {status: 401, msg: 'Unauthorized'}
    }
};
