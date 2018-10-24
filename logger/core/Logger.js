const middleware = require('./middleware');
const connect = require('./connect');
const write = require('./write');
const set = require('./set');

module.exports = Logger;

function Logger() {
    this.uri = null;
    this.request = null;


}

Logger.set = set.bind(Logger);

Logger.info     = write.bind(Logger, 'INFO');
Logger.debug    = write.bind(Logger, 'DEBUG');
Logger.warn     = write.bind(Logger, 'WARN');
Logger.error    = write.bind(Logger, 'ERROR');

Logger.middleware   = middleware.bind(Logger);
Logger.connect      = connect.bind(Logger);
