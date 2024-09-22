const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
    site: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('site', SiteSchema);