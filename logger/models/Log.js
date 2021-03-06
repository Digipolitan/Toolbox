const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimestampsPlugin = require('mongoose-timestamps');

const LogSchema = Schema({
    level: {
        type: String,
        required: true,
        default: 'INFO'
    },
    message: {
        type: String,
        required: false,
    },
    metadata: {
        realm: {
            type: String,
            required: false,
            default: process.env.REALM
        },
        request: {
            type: Object,
            required: false,
        },
        stack_trace: {
            type: [],
            required: false,
        }
    }
});

LogSchema.plugin(TimestampsPlugin);
LogSchema.index({ created_at: 1 }, { expireAfterSeconds: 3600 * 24 * 2 });
module.exports = mongoose.model('Line', LogSchema);
