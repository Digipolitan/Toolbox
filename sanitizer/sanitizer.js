const Promise = require('bluebird');
const _ = require('lodash');
const sanitizerFunctions = require('./sanitizer_functions');


module.exports.init = (configuration) => {

    /** Check if the configuration object is well formed **/

    if (!configuration)
        throw new Error("Missing configuration");
    if (!configuration.functions)
        throw new Error("Missing \"functions\" object in the given configuration");
    if(Object.keys(configuration.functions).length < 1)
        throw new Error("Missing field to apply in the given configuration");


    /** Check if the way of defining functions per field is good **/

    Object.keys(configuration.functions).forEach((field) => {
        const functions = configuration.functions;

        if (!(functions[field] instanceof Array) && functions[field] instanceof String)
            functions[field] = [functions[field]];

        if (!(functions[field] instanceof Array))
            throw new Error(`Invalid configuration format for field ${field}`);
    });

    /** Return the process applied to the JSON input, have to call .start to start the process **/

    return {
        start: function (input) {
            let notAlteredField = new Set();

            if (input instanceof Object && input.constructor === Object)
                input = [input];

            if (!Array.isArray(input))
                return Promise.reject(new Error('Invalid input'));

            const output = _.cloneDeep(input);

            const promises = input.reduce((acc, element, index) => {

                Object.keys(element).forEach(field => {
                    if (configuration.functions[field]) {
                        configuration.functions[field].forEach(func => {

                            const callback = sanitizerFunctions.listOfFunctions[func];

                            if (callback === undefined) {
                                acc.push(Promise.reject(new Error(`Function ${func} does not exists`)));
                            } else {
                                acc.push(callback(element[field]).then(result => output[index][field] = result));
                            }

                        });
                    } else {
                        if (configuration.full_stack_trace)
                            notAlteredField.add(field);
                    }

                });

                return acc;
            }, []);


            if (configuration.full_stack_trace)
                notAlteredField.forEach((field) => {
                    console.log(`There is no process applied to ${field} field`);
                });

            return Promise.all(promises)
                .then(() => output);
        },
    };
};



