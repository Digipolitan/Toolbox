const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = () => {
    const LOGGER_MONGODB_URI = process.env.LOGGER_MONGODB_URI;

    if (LOGGER_MONGODB_URI === undefined)
        throw new Error('missing env property : LOGGER_MONGODB_URI');

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

        const mongoDB = mongoose.connect(LOGGER_MONGODB_URI, options);

        return mongoDB
            .then(() => clearTimeout(firstConnectTimeout))
            .then(() => console.log(`Connected to Logger (${LOGGER_MONGODB_URI}).`))
            .catch((err) => { console.error(`Connection to Logger (${LOGGER_MONGODB_URI}) failed. \n${err}. \nRetrying...`); firstConnectTimeout = setTimeout(mongoConnect, 5000); });
    }
};
