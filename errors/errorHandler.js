module.exports = function (localizable) {
    return function (req, res, error) {
        let message = localizable.getMessage(error.message, 'en', error.args);

        if (!error)
            return res.status(500).send();

        console.error({
            reason: error.reason || error.message || error,
            message,
        });

        if(error.stack)
            console.error(error.stack);

        let code = (error.code && error.code >= 200 && error.code <= 503) ? error.code : 500;
        return res
            .status(code)
            .send({
                reason: error.reason || error.message || error,
                message
            });
    };
}