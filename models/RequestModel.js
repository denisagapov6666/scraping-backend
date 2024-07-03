const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Request', URLSchema);