const _ = require('lodash');

module.exports = (req) => {
    if(!req)
        return undefined;

    const request = _.pick(req, ['user', 'headers', 'originalUrl', 'method', 'params', 'query', 'body']);

    if (request.body)
        request.body = _.omit(request.body, ['password']);

    return request;
};
