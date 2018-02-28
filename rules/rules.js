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
 *      suffix : String, Optional, added before each missing property found
 *      prefix : String, Optional, added after each missing property found
 *      errorKey : String, Optional, errorKey dispatched to context.error(code, key, args)
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
        return !missing.length || context.error(400, opts.errorKey ? 'missing.fields' : opts.errorKey, missing.join(', '));
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
 *      suffix : String, Optional, added before each missing property found
 *      prefix : String, Optional, added after each missing property found
 *      errorKey : String, Optional, errorKey dispatched to context.error(code, key, args)
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
                    if (validators.isObjectId(_.get(item, property)))
                        invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                if (validators.isObjectId(_.get(_target, property)))
                    invalid.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !invalid.length || context.error(400, opts.errorKey ? 'invalid.objectIds' : opts.errorKey, invalid.join(', '));
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
 *      suffix : String, Optional, added before each missing property found
 *      prefix : String, Optional, added after each missing property found
 *      errorKey : String, Optional, errorKey dispatched to context.error(code, key, args)
 *      min : Number, Optional, min size of Array
 *      max : Number, Optional, max size of Array
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
                    let value = _.get(item, property);
                    if (!Array.isArray(value) || value.length === 0)
                        invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                let value = _.get(_target, property);
                if (validators.ensureNonEmptyArray(value))
                    invalid.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !invalid.length || context.error(400, opts.errorKey ? 'invalid.arrays' : opts.errorKey, invalid.join(', '));
    }
}

function ensureStrings(target, properties, errorKey, prefix, suffix) {
    return function _ensureTypes(context) {
        const invalid = [];
        const _prefix = prefix || '';
        const _suffix = suffix || '';

        const _target = _.get(context, target);

        if (Array.isArray(_target)) {
            _target.forEach((item, index) => {
                properties.forEach(property => {
                    let value = _.get(item, property);
                    if (!validators.isTypeOf(value, type))
                        invalid.push(`${_prefix}${target}[${index}].${property}${_suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                let value = _.get(_target, property);
                if (validators.ensureNonEmptyArray(value))
                    invalid.push(`${_prefix}${target}.${property}${_suffix}`);
            });
        }
        return !invalid.length || context.error(400, errorKey === undefined ? 'invalid.types' : errorKey, [type, invalid.join(', ')]);
    }
}

module.exports = {
    ensureRequiredProperties,
    ensureObjectIds,
    ensureArrays
}