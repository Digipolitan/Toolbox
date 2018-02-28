module.exports = {
    listOfFunctions: {
        "upperCase": upperCase,
        "trim": trim,

    }
};

function upperCase(input) {

    if (typeof input === "string")
        return Promise.resolve(input.toUpperCase());
    else
        return Promise.reject(new Error("Invalid field"));

}


function trim(input) {

    if (typeof input === "string") {
        return Promise.resolve(input.trim());
    }
    else
        return Promise.reject(new Error("Invalid field"));

}

