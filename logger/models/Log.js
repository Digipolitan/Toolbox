const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimestampsPlugin = require('mongoose-timestamps');

const LogSchema = Schema({
    request: {
        type: Object,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    stack_trace: {
        type: [],
        required: false,
    },
    level: {
        type: String,
        required: true,
        default: 'ERROR'
    },
    realm: {
        type: String,
        default: process.env.REALM
    }
});

LogSchema.plugin(TimestampsPlugin);

module.exports = mongoose.model('Log', LogSchema);
