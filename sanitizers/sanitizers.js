const _ = require('lodash');
const validators = require('../validators/fieldsValidator');

function blacklistProperties(target, properties) {
    return function _blacklistProperties(context) {
        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (properties === null) {
            if (target !== 'context')
                _.unset(context, target);
        } else {
            if (validators.isArray(_target)) {
                _target.forEach((item) => {
                    validators.blacklist(item, properties);
                });
            } else {
                validators.blacklist(_target, properties);
            }
        }
        return true;
    }
}

function whitelistProperties(target, properties) {
    return function _blacklistProperties(context) {
        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (validators.isArray(_target)) {
            _target.forEach((item) => {
                validators.whitelist(item, properties);
            });
        } else {
            validators.whitelist(_target, properties);
        }
        return true;
    }
}

function trimProperties(target, properties) {
    return function _trimProperties(context) {
        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                return true;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item) => {
                _trim(item, properties);
            });
        } else {
            _trim(_target, properties);
        }
        return true;
    }

    function _trim(data, properties) {
        for (let property of properties) {
            const value = _.get(data, property);
            if (validators.isString(value))
                _.set(data, property, value.trim());
        }
    }
}

function capitalizeProperties(target, properties) {
    return function _capitalizeProperties(context) {
        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                return true;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item) => {
                _capitalize(item, properties);
            });
        } else {
            _capitalize(_target, properties);
        }
        return true;
    }

    function _capitalize(data, properties) {
        for (let property of properties) {
            const value = _.get(data, property);
            if (validators.isString(value))
                _.set(data, property, _.capitalize(value));
        }
    }
}

function uppercaseProperties(target, properties) {
    return function _uppercaseProperties(context) {
        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                return true;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item) => {
                _uppercase(item, properties);
            });
        } else {
            _uppercase(_target, properties);
        }
        return true;
    }

    function _uppercase(data, properties) {
        for (let property of properties) {
            const value = _.get(data, property);
            if (validators.isString(value))
                _.set(data, property, value.toUpperCase());
        }
    }
}

function lowercaseProperties(target, properties) {
    return function _lowercaseProperties(context) {
        if (target === null || target === undefined || target === '' || target === 'context')
            target = 'context';

        const _target = target === 'context' ? context : _.get(context, target);

        if (!validators.isArray(properties)) {
            if (validators.isString(properties))
                properties = [properties];
            else
                return true;
        }

        if (validators.isArray(_target)) {
            _target.forEach((item) => {
                _lowercase(item, properties);
            });
        } else {
            _lowercase(_target, properties);
        }
        return true;
    }

    function _lowercase(data, properties) {
        for (let property of properties) {
            const value = _.get(data, property);
            if (validators.isString(value))
                _.set(data, property, value.toLowerCase());
        }
    }
}

module.exports = {
    blacklistProperties,
    whitelistProperties,
    trimProperties,
    capitalizeProperties,
    uppercaseProperties,
    lowercaseProperties
}