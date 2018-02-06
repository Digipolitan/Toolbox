const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let CounterSchema;
let counter;
module.exports = (schema, options) => {
    if (!CounterSchema) {
        CounterSchema = Schema({
            _id: {type: String, required: true},
            seq: {type: Number, default: 0}
        });

        counter = mongoose.model('counter', CounterSchema);
    }

    if (!options || !options.key || !options.model)
        throw Error('missing configuration options');

    schema.pre('save', function (next) {
        const doc = this;

        if (!this.isNew)
            return next();

        if (typeof (doc[options.key]) !== 'number')
            throw Error('auto-incremented property must be Number type');

        counter.findOneAndUpdate(
            {_id: `${options.model}.${options.key}`},
            {$inc: {seq: 1}},
            {new: true, upsert: true},
            (err, result) => {
                doc[options.key] = result.seq;
                next();
            });
    });
};