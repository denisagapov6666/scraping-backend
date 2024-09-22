const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
    site: {
        type: String,
        required: true
    },
    added: {
        type: Number,
        default: 0
    },
    removed: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('histories', URLSchema);