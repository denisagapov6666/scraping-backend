const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
    site: {
        type: String,
        required: true
    },
    history: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "histories"
    },
    message: {
        type: String
    },
    status: {
        type: String,
        defualt: 'info'
    }
}, { timestamps: true });

module.exports = mongoose.model('logs', LogSchema);