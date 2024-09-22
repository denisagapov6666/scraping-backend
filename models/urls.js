const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
    site:{
        type:String
    },
    url: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    },
    new: {
        type: Boolean,
        required: true,
        default: true
    },
    productsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('urls', URLSchema);