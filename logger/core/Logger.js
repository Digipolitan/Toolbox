const Log = require('../models/Log');
const _ = require('lodash');

module.exports = class Logger {
    constructor(req) {
        this.req = req;
    }

    log(...args) {
        this.saveLog(args, 'LOG');
    }

    debug(...args) {
        this.saveLog(args, 'DEBUG');
    }

    info(...args) {
        this.saveLog(args, 'INFO');
    }

    warn(...args) {
        this.saveLog(args, 'WARN');
    }

    error(...args) {
        this.saveLog(args, 'ERROR');
    }

    saveLog(args, level) {
        let stackTrace;
        let request;

        if (this.req) {
            request = _.pick(this.req, ['user', 'headers', 'originalUrl', 'method', 'params', 'query', 'body']);
            if (request.body)
                request.body = Object.keys(request.body)
                    .reduce((acc, key) => {
                        if (key.includes('password'))
                            return acc;
                        acc[key] = request.body[key];
                        return acc;
                    }, {})
        }

        if (args && args[0] instanceof Error)
            stackTrace = args[0].stack.split('\n');

        return Log.create({
            request: request,
            message: args,
            stack_trace: stackTrace,
            level: level.toUpperCase(),
        });
    }
};

