const mongoose = require('mongoose');
const _ = require('lodash');

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
    let missing = [];
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
    for (const field in data) {
        if (!properties.find(p => p == field)) {
            delete data[field];
        }
    }
    return true;
}

function blacklist(data, properties) {
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
    let invalids = [];
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
    let invalids = [];
    for (let property of properties) {
        if (!isArray(_.get(data, property, options)))
            invalids.push(property);
    }
    return invalids;
}

function isString(value, options) {
    const opts = options || {};
    if (typeof value !== 'string')
        return false;
    if (opts.min !== undefined && opts.min >= 0 && value.length < opts.min)
        return false;
    if (opts.max !== undefined && opts.max >= 0 && value.length > opts.max)
        return false;
    return true;
}

function areString(data, properties, options) {
    let invalids = [];
    for (let property of properties) {
        if (!isString(_.get(data, property, options)))
            invalids.push(property);
    }
    return invalids;
}

function isNumber(value, options) {
    const opts = options || {};

    if (typeof value !== 'number')
        return false;
    if (opts.min !== undefined && value < opts.min)
        return false;
    if (opts.max !== undefined && value > opts.max)
        return false;

    return true;
}

function areNumber(data, properties, options) {
    let invalids = [];
    for (let property of properties) {
        if (!isNumber(_.get(data, property, options)))
            invalids.push(property);
    }
    return invalids;
}

module.exports = {
    isEmail,
    isPhoneNumber,
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
    areNumber
};
