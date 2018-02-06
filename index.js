const utils = {};
const plugins = require('./misc/plugins');

utils.URIPlugin = plugins.URI;
utils.AutoIncrementPlugin = plugins.AutoIncrement;

utils.loadFromEnv = require('./misc/loadFromEnv');
utils.localizable = require('./localizable/localizable');
utils.fieldsValidator = require('./validators/fieldsValidator');

module.exports = utils;
