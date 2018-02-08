module.exports = function (localizable) {
    return function (req, res, error) {
        let message = localizable.getMessage(error.message, 'en-EN', error.args);

        if (!error)
            return res.status(500).send();

        console.error((error.stack ? error.stack : error));

        let code = (error.code && error.code >= 200 && error.code <= 503) ? error.code : 500;
        return res
            .status(code)
            .send({
                reason: error.reason || error.message || error,
                message
            });

    };
}
