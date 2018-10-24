const morgan = require('morgan');
const Writable = require('stream').Writable;
const extractRequestData = require('../utils/extractRequestData');

module.exports = function (req, res, next) {
    const stream = new Writable();
    const self = this;

    stream._write = function onData(buffer, type, cb) {
        const data = JSON.parse(buffer.toString());
        const level = data.level;
        const message = data.message;

        self[level](message);
        cb();
    };

    return morgan(formatLine, { stream })(req, res, next);

    function formatLine(morgan, req, res) {
        const request = extractRequestData(req);

        const method = morgan['method'](req, res);
        const url = morgan['url'](req, res);
        const status = morgan['status'](req, res);
        const responseTime = morgan['response-time'](req, res);

        const level = status >= 500 && 'error'
            || status >= 400 && 'warn'
            || 'info';

        request.status = status;

        const message = `${status || 0} | [${method}] ${url} - ${responseTime || 0}ms`;

        return JSON.stringify({
            request,
            message,
            level
        });
    }
};


