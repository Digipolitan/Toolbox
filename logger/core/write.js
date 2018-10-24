const extractRequestData = require('../utils/extractRequestData');
const Log = require('../models/Log');

module.exports = function (level, message) {
    const request = extractRequestData(this.request);
    let stack_trace;

    if (message instanceof Error)
        stack_trace = message.stack.split('\n');

    console[level.toLowerCase()](message);

    return Log.create({
        level,
        message,
        metadata: { request, stack_trace }
    });
};

