const morgan = require('morgan');
const Writable = require('stream').Writable;

module.exports = app => {
    const stream = new Writable();

    stream._write = onData;

    return app.router.use(morgan(formatLine, { stream }));

    function onData(buffer, type, cb) {
        const data = JSON.parse(buffer.toString());
        const request = data.request;
        const level = data.level;
        const message = data.message;

        new app.utils.logger.Logger(request)[level](message);

        console[level](message);

        cb();
    }

    function formatLine(morgan, req, res) {
        const request = app.utils.logger.utils.getFormattedRequest(req);

        const method = morgan['method'](req, res);
        const url = morgan['url'](req, res);
        const status = morgan['status'](req, res);
        const contentLength = morgan['res'](req, res, 'content-length');
        const responseTime = morgan['response-time'](req, res);

        const level = status >= 500 && 'error'
            || status >= 400 && 'error'
            || status >= 300 && 'info'
            || status >= 200 && 'log'
            || 'info';

        request.status = status;

        const message = `${method} ${url} ${status} - content-length: ${contentLength} - response-time: ${responseTime} ms`;

        return JSON.stringify({
            request,
            message,
            level
        });
    }
};
