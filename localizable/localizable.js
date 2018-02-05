/**
 * Module allowing to retrieve template literal based on a key and a language
 * You have to provide the collection of strings on the following format:
 * {
 *      "key" :
 *          {
 *              "EN" : "In english with params ${0} ${1} ${0}
 *              "FR" : "En francais avec parametres ${0} ${1} ${0}"
 *          }
 * }
 *
 * Calling getMessage("key", "EN", ["Foo", "Bar"]) will return "In english with params Foo Bar Foo"
 * Calling getMessage("key", "FR", ["Foo", "Bar"]) will return "En francais avec parametres Foo Bar Foo"
 * Calling getMessage("key", "EN") will return "In english with params"
 * Calling getMessage("key", "DE") will return "key"
 */

module.exports = (messages) => {
    const templates = {};
    return {
        getMessage
    };

    /**
     *
     * @param key The key refering to the targeted String collection in the provided messages collection
     * @param language The language targeted in the collection found for the key
     * @param values The values to use for replacement in the targeted String, can be an Array or a single value
     * @returns {*}
     */
    function getMessage(key, language, values) {
        if (messages === undefined || messages[key] === undefined || typeof messages[key][language] !== 'string')
            return key;
        if (templates[key] === undefined)
            templates[key] = {};
        if (templates[key][language] === undefined)
            try {
                templates[key][language] = assemble(messages[key][language]);
            } catch (e) {
                return key;
            }
        return templates[key][language](values instanceof Array ? values : [values]); // if not already an array we put values in an Array, since the templace will get values at indexes (in a string it would take letters)
    }
};

function assemble(literal) {
    /**
     *  The objective is to create a dynamic template literal (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
     *  But you can't put a variable in it because it will use it as part of the template
     *  So the idea is to break the interpretation of the literal by using the Function constructor.
     *  By doing this, the variable will be interpreted and then calling the function will generate the wanted literal.
     *  We bind our templating function to this new Function so we can refer to it using 'this'.
     */
    return new Function("return this`" + literal + "`;").bind(model)();
}

/**
 *  The templating function that return a parametrized function
 *  to replaces all ${i} occurences in the literal by the provided values each time it's called or leaving the pattern if values[i] is undefined
 */
function model(strings, ...keys) {
    return (function (values) {
        return keys.reduce((acc, key, i) => {
            const value = Number.isInteger(key) ? values[key] : '';
            return acc += (value ? value : '${' + key + '}') + strings[i + 1];
        }, strings[0]);
    });
}