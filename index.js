const utils = {};

utils.uriPlugin = require('./misc/uriplugin')
utils.loadFromEnv = require('./misc/loadFromEnv');
utils.autoIncrementPlugin = require('./misc/loadFromEnv');
utils.localizable = require('./localizable/localizable');
utils.fieldsValidator = require('./validators/fieldsValidator');

module.exports = utils;