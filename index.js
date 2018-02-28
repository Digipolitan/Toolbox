const utils = {};
const plugins = require('./misc/plugins');

utils.URIPlugin = plugins.URI;

utils.loadFromEnv = require('./misc/loadFromEnv');
utils.getIssuerLanguage = require('./misc/getIssuerLanguage');

utils.localizable = require('./localizable/localizable');
utils.fieldsValidator = require('./validators/fieldsValidator');
utils.errorHandler = require('./errorhandler/errorHandler');
utils.benchmark = require('./benchmark');
utils.sanitizer = require('./sanitizer/sanitizer');
utils.rules = require('./rules/rules');

module.exports = utils;
