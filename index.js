const utils = {};
const plugins = require('./misc/plugins');

utils.URIPlugin = plugins.URI;

utils.loadFromEnv = require('./misc/loadFromEnv');
utils.getIssuerLanguage = require('./misc/getIssuerLanguage');
utils.localizable = require('./localizable/localizable');
utils.fieldsValidator = require('./validators/fieldsValidator');
utils.errorHandler = require('./errors/errorHandler');
utils.defaultErrors = require('./errors/default.json');
utils.benchmark = require('./benchmark');
utils.sanitizers = require('./sanitizers/sanitizers');
utils.rules = require('./rules/rules');
utils.slugs = require('./slugs/slugs');
utils.AWSBlobsManager = require('./blobs/AWSBlobsManager');
utils.OSSBlobsManager = require('./blobs/OSSBlobsManager');
utils.aggregate = require('./aggregate');
utils.logger = require('./logger');

module.exports = utils;