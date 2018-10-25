const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = function (uri) {
    if (!uri)
        return;

    this.uri = uri;
    let firstConnectTimeout = null;

    return mongoConnect();

    function mongoConnect() {
        const options = {
            keepAlive: 1,
            useNewUrlParser: true,
            connectTimeoutMS: 30000,
            reconnectTries: 500,
            poolSize: 50
        };
        const mongoDB = mongoose.connect(uri, options);

        return mongoDB
            .then(() => clearTimeout(firstConnectTimeout))
            .then(() => console.log(`Connected to Logger (${uri}).`))
            .catch((err) => {
                console.error(`Connection to Logger (${uri}) failed. \n${err}. \nRetrying...`);
                firstConnectTimeout = setTimeout(mongoConnect, 5000);
            });
    }
};