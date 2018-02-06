const path = require('path');

module.export = (schema, options) => {
    if (!options || !options.path)
        throw Error('missing configuration options');

    const route = options.path;
    const identifier = options.identifier || '_id' || 'id';

    schema.virtual('uri').get(function () {
        return path.join(route, this[identifier].toString());
    });
};