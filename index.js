const utils = {};
const plugins = require('./misc/plugins');

utils.URIPlugin = plugins.URI;

utils.loadFromEnv = require('./misc/loadFromEnv');
utils.localizable = require('./localizable/localizable');
utils.fieldsValidator = require('./validators/fieldsValidator');
utils.errorHandler = require('./errorhandler/errorHandler');

module.exports = utils;
