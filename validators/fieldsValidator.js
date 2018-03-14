const mongoose = require('mongoose');
const _ = require('lodash');
const slugs = require('../slugs/slugs');

function isEmail(text) {
    return /\S+@\S+\.\S+/.test(text);
}

function isPhoneNumber(phoneNumber) {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phoneNumber)
}

function hasProperty(data, property) {
    if (_.get(data, property) === undefined)
        return false;
    return true;
}

function hasProperties(data, properties) {
    const missing = [];

    if (!isArray(properties)) {
        if (isString(properties))
            properties = [properties];
        else
            return missing;
    }

    for (let property of properties) {
        if (_.get(data, property) === undefined)
            missing.push(property);
    }
    return missing;
}

function hasLength(data, min, max) {
    return data.length >= min && data.length <= max;
}

function whitelist(data, properties) {
    if (!isArray(properties)) {
        if (isString(properties))
            properties = [properties];
        else
            return true;
    }

    for (const field in data) {
        if (!properties.find(p => p == field)) {
            delete data[field];
        }
    }
    return true;
}

function blacklist(data, properties) {

    if (!isArray(properties)) {
        if (isString(properties))
            properties = [properties];
        else
            return true;
    }

    for (const field of properties) {
        if (data[field] !== undefined) {
            delete data[field];
        }
    }
    return true;
}


function isObjectId(value) {
    return mongoose.Types.ObjectId.isValid(value);
}

function areObjectId(data, properties) {
    const invalids = [];

    if (!isArray(properties)) {
        if (isString(properties))
            properties = [properties];
        else
            return invalids;
    }

    for (let property of properties) {
        if (!isObjectId(_.get(data, property)))
            invalids.push(property);
    }
    return invalids;
}

function isArray(value, options) {
    const opts = options || {};
    if (!Array.isArray(value))
        return false;
    if (opts.min !== undefined && opts.min >= 0 && value.length < opts.min)
        return false;
    if (opts.max !== undefined && opts.max >= 0 && value.length > opts.max)
        return false;
    return true;
}

function areArray(data, properties, options) {
    const invalids = [];

    if (!isArray(properties)) {
        if (isString(properties))
            properties = [properties];
        else
            return invalids;
    }

    for (let property of properties) {
        if (!isArray(_.get(data, property, options)))
            invalids.push(property);
    }
    return invalids;
}

function isString(value, options) {
    const opts = options || {};

    if (!_.isString(value))
        return false;
    if (opts.min !== undefined && opts.min >= 0 && value.length < opts.min)
        return false;
    if (opts.max !== undefined && opts.max >= 0 && value.length > opts.max)
        return false;
    return true;
}

function areString(data, properties, options) {
    const invalids = [];

    if (!isArray(properties)) {
        if (isString(properties))
            properties = [properties];
        else
            return invalids;
    }

    for (let property of properties) {
        if (!isString(_.get(data, property, options)))
            invalids.push(property);
    }
    return invalids;
}

function isNumber(value, options) {
    const opts = options || {};

    if (!_.isNumber(value))
        return false;
    if (opts.min !== undefined && value < opts.min)
        return false;
    if (opts.max !== undefined && value > opts.max)
        return false;

    return true;
}

function areNumber(data, properties, options) {
    const invalids = [];

    if (!isArray(properties)) {
        if (isString(properties))
            properties = [properties];
        else
            return invalids;
    }

    for (let property of properties) {
        if (!isNumber(_.get(data, property, options)))
            invalids.push(property);
    }
    return invalids;
}

function isSlug(value) {
    return slugs.validate(value);
}

function isDate(value) {
    return !isNaN(Date.parse(value))
}

module.exports = {
    isEmail,
    isPhoneNumber,
    hasProperty,
    hasProperties,
    hasLength,
    whitelist,
    blacklist,
    isObjectId,
    areObjectId,
    isArray,
    areArray,
    isString,
    areString,
    isNumber,
    areNumber,
    isSlug,
    isDate
};
