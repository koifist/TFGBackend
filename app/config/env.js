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
        stock: {
            stockCurrentPrices: 'https://api.worldtradingdata.com/api/v1/stock?symbol=AAPL,AMZN,MSFT,GOOG&api_token=wbXSKGMZFEirgOasj7zJIfBKhFPb3WJ21rssBKK5k0QQB4SSfjUFw2Lm2VNu',
            historyApple: 'https://intraday.worldtradingdata.com/api/v1/intraday?symbol=AAPL&range=1&interval=5&api_token=wbXSKGMZFEirgOasj7zJIfBKhFPb3WJ21rssBKK5k0QQB4SSfjUFw2Lm2VNu&sort=asc',
            historyAmazon: 'https://intraday.worldtradingdata.com/api/v1/intraday?symbol=AMZN&range=1&interval=5&api_token=wbXSKGMZFEirgOasj7zJIfBKhFPb3WJ21rssBKK5k0QQB4SSfjUFw2Lm2VNu&sort=asc',
            historyMicrosoft: 'https://intraday.worldtradingdata.com/api/v1/intraday?symbol=MSFT&range=1&interval=5&api_token=wbXSKGMZFEirgOasj7zJIfBKhFPb3WJ21rssBKK5k0QQB4SSfjUFw2Lm2VNu&sort=asc',
            historyGoogle: 'https://intraday.worldtradingdata.com/api/v1/intraday?symbol=GOOG&range=1&interval=5&api_token=wbXSKGMZFEirgOasj7zJIfBKhFPb3WJ21rssBKK5k0QQB4SSfjUFw2Lm2VNu&sort=asc'
        }
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
        ERR401: {status: 401, msg: 'Unauthorized'},
        ERR405: {status: 405, msg: 'Captured error'}
    }
};
