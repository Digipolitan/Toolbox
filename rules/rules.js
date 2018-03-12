const _ = require('lodash');
const validators = require('../validators/fieldsValidator');
const slugs = require('../slugs/slugs');

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

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isObjectId(item))
                        missing.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if (!validators.hasProperty(item, property))
                            missing.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if (_target === undefined)
                    missing.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if (!validators.hasProperty(_target, property))
                        missing.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !missing.length || context.error(400, opts.errorKey ? opts.errorKey : 'missing_fields', missing.join(', '));
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
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureObjectIds(target, properties, options) {
    return function _ensureObjectIds(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isObjectId(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isObjectId(_.get(item, property)))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isObjectId(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isObjectId(_.get(_target, property)))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_objectIds', invalid.join(', '));
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
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */

function ensureArrays(target, properties, options) {
    return function _ensureNonEmptyArray(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);
        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target) && properties !== null) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isArray(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isArray(_.get(item, property), opts))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isArray(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isArray(_.get(_target, property), opts))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_arrays', opts.min === undefined ? 'none' : opts.min, opts.max === undefined ? 'none' : opts.max, invalid.join(', '));
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
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureStrings(target, properties, options) {
    return function _ensureTypes(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isString(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isString(_.get(item, property), opts))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isString(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isString(_.get(_target, property), opts))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_strings', opts.min === undefined ? 'none' : opts.min, opts.max === undefined ? 'none' : opts.max, invalid.join(', '));
    }
}

/**
 *  Searches for properties in context.target and check if they are emails.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each invalid property found
 *      prefix : String, added after each invalid property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureEmails(target, properties, options) {
    return function _ensureTypes(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isEmail(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isEmail(_.get(item, property)))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isEmail(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isEmail(_.get(_target, property), opts))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
            return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_emails', invalid.join(', '));
        }
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
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureNumbers(target, properties, options) {
    return function _ensureTypes(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isNumber(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isNumber(_.get(item, property), opts))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isNumber(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isNumber(_.get(_target, property), opts))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_numbers', opts.min === undefined ? 'none' : opts.min, opts.max === undefined ? 'none' : opts.max, invalid.join(', '));
    }
}

/**
 *  Searches for properties in context.target and check if they are phone numbers.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each invalid property found
 *      prefix : String, added after each invalid property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensurePhoneNumbers(target, properties, options) {
    return function _ensureTypes(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);


        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isPhoneNumber(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isPhoneNumber(_.get(item, property)))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isPhoneNumber(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isPhoneNumber(_.get(_target, property)))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_phone_numbers', invalid.join(', '));
    }
}

/**
 *  Searches for properties in context.target and check if they are proper slugs.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each invalid property found
 *      prefix : String, added after each invalid property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureSlugs(target, properties, options) {
    return function _ensureTypes(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isSlug(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isSlug(_.get(item, property)))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isPhoneNumber(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isSlug(_.get(_target, property)))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_slugs', invalid.join(', '));
    }
}


/**
 *  Searches for properties in context.target and check if they are proper dates.
 *  If context.target is an Array, properties will be checked in each object inside the Array
 *
 * @param target Target path in the context object
 * @param properties Properties that are expected to be found on target
 * @param options format :
 * {
 *      suffix : String, added before each invalid property found
 *      prefix : String, added after each invalid property found
 *      errorKey : String, errorKey dispatched to context.error(code, key, args)
 *      required : Boolean, default : true; If set to false, missing properties wont be consider wrong
 * }
 * @returns a function(context) to be put in you Action's rules array.
 */
function ensureDates(target, properties, options) {
    return function _ensureDates(context) {
        const invalid = [];
        const opts = options || {};
        const prefix = opts.prefix || '';
        const suffix = opts.suffix || '';
        const required = opts.required === undefined ? true : opts.required;

        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                properties = null;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item, index) => {
                if (properties === null) {
                    if (!validators.isDate(item))
                        invalid.push(`${prefix}${target}[${index}]${suffix}`);
                } else {
                    properties.forEach(property => {
                        if ((validators.hasProperty(item, property) || required) && !validators.isDate(_.get(item, property)))
                            invalid.push(`${prefix}${target}[${index}].${property}${suffix}`);
                    });
                }
            });
        } else {
            if (properties === null) {
                if ((_target !== undefined || required) && !validators.isDate(_target))
                    invalid.push(`${prefix}${target}${suffix}`);
            } else {
                properties.forEach(property => {
                    if ((validators.hasProperty(_target, property) || required) && !validators.isDate(_.get(_target, property)))
                        invalid.push(`${prefix}${target}.${property}${suffix}`);
                });
            }
        }
        return !invalid.length || context.error(400, opts.errorKey ? opts.errorKey : 'invalid_date', invalid.join(', '));
    }
}

module.exports = {
    ensureRequiredProperties,
    ensureObjectIds,
    ensureArrays,
    ensureStrings,
    ensureNumbers,
    ensureEmails,
    ensurePhoneNumbers,
    ensureSlugs,
    ensureDates
}