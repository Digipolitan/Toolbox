const _ = require('lodash');
const validators = require('../validators');

function ensureRequiredProperties(target, properties, errorKey, prefix, suffix) {
    return function _ensureRequiredProperties(context) {
        const missing = [];
        const _prefix = prefix || '';
        const _suffix = suffix || '';

        const _target = _get(context, target);

        if (Array.isArray(target)) {
            _target.forEach((item, index) => {
                properties.forEach(property => {
                    if (_.get(context, `${target}.${property}`) === undefined)
                        missing.push(`${prefix}${target}[${index}].${property}${suffix}`);
                });
            });
        } else {
            properties.forEach(property => {
                if (_.get(target, property) === undefined)
                    missing.push(`${prefix}${target}.${property}${suffix}`);
            });
        }
        return !missing.length || context.error(400, errorKey === undefined ? 'missing.fields' : errorKey, missing.join(', '));
    }
}

function ensureObjectIds(target, properties, errorKey) {
    return function _ensureObjectIds(context) {
        const invalid = [];
        properties.forEach(property => {
            if (validators.fieldsValidator.ensureObjectId(_.get(context, target + '.' + property)))
                invalid.push(target + '.' + property);
        });
        return !invalid.length || context.error(400, errorKey === undefined ? 'invalid.objectIds' : errorKey, invalid.join(', '));
    }
}

function ensureNonEmptyArrays(target, properties, errorKey) {
    return function _ensureNonEmptyArray(context) {
        const invalid = [];
        properties.forEach(property => {
            if (!Array.isArray(context.data.lesson_types) || !context.data.lesson_types.length)
                invalid.push(target + '.' + property);
        })
        return !invalid.length || context.error(400, errorKey === undefined ? 'invalid.arrays' : errorKey, invalid.join(', '));
    }
}

module.exports = {
    ensureRequiredProperties,
    ensureObjectIds,
    ensureNonEmptyArrays
}