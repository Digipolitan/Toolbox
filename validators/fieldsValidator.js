const mongoose = require('mongoose');
const _ = require('lodash');

function isEmail(text) {
    return /\S+@\S+\.\S+/.test(text);
}

function isPhoneNumber(phoneNumber) {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phoneNumber)
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

function ensureLocalesValid(references, locales) {
    let wrongLocales = [];
    for (let locale of locales)
        Object.keys(locale).forEach(l => {
            if (!references.includes(l))
                wrongLocales.push(l);
        })
    return wrongLocales;
}

function ensureObjectId(data, properties) {
    let invalids = [];
    for (let property of properties) {
        if (!mongoose.Types.ObjectId.isValid(_.get(data, property)))
            invalids.push(property);
    }
    return invalids;
}

module.exports = {
    ensureLocalesValid,
    isEmail,
    isPhoneNumber,
    hasProperties,
    hasLength,
    whitelist,
    blacklist,
    ensureObjectId
};
