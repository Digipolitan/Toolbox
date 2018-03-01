const _ = require('lodash');
const validators = require('../validators/fieldsValidator');

/**
 *  Searches for properties in context.target
 *  If context.target is an Array, properties will be searched in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each missing property found
 *      prefix : String, added after each missing property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureRequiredProperties(target, properties, options) {

    return function _ensureRequiredProperties(context) {
        const missing = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';

        const _target = _.get(context, target);

        if (Array.isArray(_target)) {
            _target.forEach((item, index) => {
                properties.forEach(property => {
                    if (_.get(item, property) === undefined)
                        missing.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                if (_.get(_target, property) === undefined)
                    missing.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !missing.length || context.error(400, opts.errorKey ? opts.errorKey :'missing.fields', missing.join(', '));
    }
}

/**
 *  Searches for properties in context.target and check if they are valid Mongoose ObjectId.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each missing property found
 *      prefix : String, added after each missing property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureObjectIds(target, properties, options) {
    return function _ensureObjectIds(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';

        const _target = _.get(context, target);

        if (Array.isArray(_target)) {
            _target.forEach((item, index) => {
                properties.forEach(property => {
                    if (!validators.isObjectId(_.get(item, property)))
                        invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                if (!validators.isObjectId(_.get(_target, property)))
                    invalid.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid.objectIds', invalid.join(', '));
    }
}

/**
 *  Searches for properties in context.target and check if they are Array matching size given in options.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each invalid property found
 *      prefix : String, added after each invalid property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 *      min : Number, min size of Array
 *      max : Number, max size of Array
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */

function ensureArrays(target, properties, options) {
    return function _ensureNonEmptyArray(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';

        const _target = _.get(context, target);

        if (Array.isArray(_target)) {
            _target.forEach((item, index) => {
                properties.forEach(property => {
                    if (!validators.isArray(_.get(item, property), opts))
                        invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                if (!validators.isArray(_.get(_target, property), opts))
                    invalid.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !invalid.length || context.error(400, opts.errorKey ?  opts.errorKey : 'invalid.arrays', [opts.min === undefined ? 'none' : opts.min, opts.max === undefined ? 'none' : opts.max, invalid.join(', ')]);
    }
}

/**
 *  Searches for properties in context.target and check if they are Strings matching size given in options.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each invalid property found
 *      prefix : String, added after each invalid property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 *      min : Number, min size of String
 *      max : Number, max size of String
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureStrings(target, properties, options) {
    return function _ensureTypes(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';

        const _target = _.get(context, target);

        if (Array.isArray(_target)) {
            _target.forEach((item, index) => {
                properties.forEach(property => {
                    if (!validators.isString(_.get(item, property), opts))
                        invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                if (!validators.isString(_.get(_target, property), opts))
                    invalid.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid.strings', [opts.min === undefined ? 'none' : opts.min, opts.max === undefined ? 'none' : opts.max, invalid.join(', ')]);
    }
}

/**
 *  Searches for properties in context.target and check if they are Numbers matching values given in options.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each invalid property found
 *      prefix : String, added after each invalid property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 *      min : Number, min value of Number
 *      max : Number, max value of Number
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureNumbers(target, properties, options) {
    return function _ensureTypes(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';

        const _target = _.get(context, target);

        if (Array.isArray(_target)) {
            _target.forEach((item, index) => {
                properties.forEach(property => {
                    if (!validators.isNumber(_.get(item, property), opts))
                        invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                if (!validators.isNumber(_.get(_target, property), opts))
                    invalid.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid.numbers', [opts.min === undefined ? 'none' : opts.min, opts.max === undefined ? 'none' : opts.max, invalid.join(', ')]);
    }
}

module.exports = {
    ensureRequiredProperties,
    ensureObjectIds,
    ensureArrays,
    ensureStrings,
    ensureNumbers
}