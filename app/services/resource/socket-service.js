const env = require('../../config/env');
const cron = require('node-cron')
let google = parseFloat(env.services.company[0].price);
let amazon = parseFloat(env.services.company[0].price);
let apple = parseFloat(env.services.company[0].price);
let socket;
let company;
module.exports.init = function (io) {
    socket = io;
    io.on('connection', function () {
    });
    cron.schedule('*/30 * * * * *', () => {
        modifyPrice().then(function () {
            sendPrice().then(function () {
            })
        });
    });
};

function modifyPrice() {
    return new Promise(function (resolve) {
        let random = Math.floor(Math.random() * 4);
        if (random === 0) {
            google = google - google * 0.1 - 54;
            amazon = amazon + amazon * 0.1 + 75;
            apple = apple + apple * 0.1 + 43;
        }
        if (random === 1) {
            google = google + google * 0.1 + 83;
            amazon = amazon - amazon * 0.1 - 78;
            apple = apple + apple * 0.1 + 63;
        }
        if (random === 2) {
            google = google + google * 0.1 + 83;
            amazon = amazon + amazon * 0.1 + 63;
            apple = apple - apple * 0.1 - 74;
        }
        if (random === 3) {
            google = google - google * 0.1 - 93;
            amazon = amazon - amazon * 0.1 - 73;
            apple = apple - apple * 0.1 - 65;
        }
        if (google < 600) {
            google = google + 200;
        }
        if (google > 2500) {
            google = google - 200;
        }
        if (amazon < 600) {
            amazon = amazon + 200;
        }
        if (amazon > 2500) {
            amazon = amazon - 200;
        }
        if (apple < 600) {
            apple = apple + 200;
        }
        if (apple > 2500) {
            apple = apple - 200;
        }
        google = Math.round(google * 100) / 100;
        amazon = Math.round(amazon * 100) / 100;
        apple = Math.round(apple * 100) / 100;
        resolve();
    });
}

function sendPrice() {
    return new Promise(function (resolve) {
        let company = {
            amazon: {
                price: ''
            },
            google: {
                price: ''
            },
            apple: {
                price: ''
            }
        };
        company.amazon.price = amazon;
        company.google.price = google;
        company.apple.price = apple;
        this.company = company;
        socket.emit('stock', JSON.stringify(company));
        console.log('ola')
        resolve();
    });
}

module.exports.sendMsg = function (msg) {
    socket.on('connection', function () {
        socket.emit('message', JSON.stringify(msg));
    });
};
