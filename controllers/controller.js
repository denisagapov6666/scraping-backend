const ProductModel = require('../models/products');
const URLModel = require('../models/urls');
const historyModel = require("../models/history");
const RequestModel = require("../models/RequestModel");
const state = require("../utils/state");
const cronModel = require("../models/cron");

const getProduct = async (req, res, site) => {
    try {
        const products = await ProductModel.find({ site }).populate({path: 'url', match: {$ne: null}});
        const history = await historyModel.find({ site });
        const newdeleteamount = await state()
        return res.status(200).json({success: true, data: {products, history, total: products.length}, newdeleteamount});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message });
    }
}

const startScraping = async (req, res, site, getProductInfo, getUrls) => {
    const removed = await getUrls();
    let newpro = 0;
    if (removed.isadded > 0) {
        await getProductInfo();
        const newurlmodels = await URLModel.find({ site, new: true });
        const newproducts = await ProductModel
            .find({ url: { $in: newurlmodels.map(urlmodel => urlmodel._id) } })
        newpro = newproducts.length;
    }
    const urlmodels = await URLModel.find({ site });
    const products = await ProductModel.find({ site }).populate({path: 'url', match: {$ne: null}});
    const history = await historyModel.find({ site });
    const total = await ProductModel
        .countDocuments({ url: { $in: urlmodels.map(urlmodel => urlmodel._id) } })
    await RequestModel.findOneAndUpdate({ url: req.url }, { state: false });
    const newdeleteamount = await state()
    return res.status(200).json({ success: true, data: { removed: removed.removed, new: newpro, products, total, history },newdeleteamount })
}
const startScraping1 = async (req, res, site, getUrls) => {
    const removed = await getUrls();
    let newpro = 0;
    
    const urlmodels = await URLModel.find({ site });
    const products = await ProductModel.find({ url: { $in: urlmodels.map(urlmodel => urlmodel._id) } }).populate({ path: "url" });
    const history = await historyModel.find({ site });
    const total = await ProductModel
        .countDocuments({ url: { $in: urlmodels.map(urlmodel => urlmodel._id) } })
    await RequestModel.findOneAndUpdate({ url: req.url }, { state: false });
    const newdeleteamount = await state()
    return res.status(200).json({ success: true, data: { removed: removed.removed, new: removed.isadded, products, total, history },newdeleteamount })
}
const cron = async (req, res, site) => {
    const from = req.body.from.email;
    const to = req.body.to.email;
    const step = req.body.cron.cron;
    const cronExpression = step === "1" ? "* * *" : step === "2" ? "* * 0" : "1 * *";

    try {
        const state = await cronModel.findOne({ site });

        if (!state) {
            const newCron = new cronModel({ site, from, to, step: cronExpression });
            await newCron.save();
        } else {
            await cronModel.findOneAndUpdate({ site }, { from, to, step: cronExpression });
        }

        res.send({ message: "success" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "An error occurred while processing the request." });
    }
};
module.exports = {
    getProduct,
    startScraping,
    startScraping1,
    cron
}