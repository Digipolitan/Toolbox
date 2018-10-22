const _ = require('lodash');

module.exports = (req) => {
    const request = _.pick(req, ['user', 'headers', 'originalUrl', 'method', 'params', 'query', 'body']);

    if (request.body)
        request.body = Object.keys(request.body)
            .reduce((acc, key) => {
                if (key.includes('password'))
                    return acc;
                acc[key] = request.body[key];
                return acc;
            }, {});

    return request;
};