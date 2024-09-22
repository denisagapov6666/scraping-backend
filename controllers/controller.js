const ProductModel = require('../models/products');
const URLModel = require('../models/urls');
const historyModel = require("../models/history");
const RequestModel = require("../models/RequestModel");
const LogsModel = require('../models/log');
const state = require("../utils/state");
const cronModel = require("../models/cron");
const siteModel = require("../models/site");
const { Clog } = require('../utils/utils');
const runScraperFunction = require('../utils/cronscraper');

const getProduct = async (req, res, site) => {
    try {
        const products = await ProductModel.find({ site }).populate({path: 'url'});
        const history = await historyModel.find({ site });
        const newdeleteamount = await state();
        return res.status(200).json({success: true, data: {products, history, total: products.length}, newdeleteamount});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message });
    }
}

const startScraping = async (req, res, site, getProductInfo, getUrls) => {
    // we need to reset it because some child scraping set it as 0
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    const removed = await getUrls();
    let newpro = 0;
    if (removed?.isadded > 0) {
        await getProductInfo();
        Clog.info(site, `Done`);
        const newproducts = await ProductModel.find({ site }).populate({
            path: 'url',
            match: { new: true }
        });
        newpro = newproducts.length;
    }

    await RequestModel.findOneAndUpdate({ url: req.url }, { state: false });
    
    const products = await ProductModel.find({ site }).populate({path: 'url'});
    const history = await historyModel.find({ site });
    const total = products.length;
    await RequestModel.findOneAndUpdate({ url: req.url }, { state: false });
    const newdeleteamount = await state()
    return res.status(200).json({ success: true, data: { removed: removed?.removed, new: newpro, products, total, history },newdeleteamount })
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
const getLogs = async(req, res) => {
    const count = req.query.count ?? 100;
    const logs = await LogsModel.find().sort({updatedAt: -1, _id: -1}).skip(0).limit(count);
    return res.json({
        success: true, 
        logs: logs
    });
}
const cronScraper = async(req, res) => {
    try {
        // Fetch the last updated site
        let lastUpdatedSite = await siteModel.findOne().sort({ updatedAt: 1 }).exec();
        
        if (!lastUpdatedSite) {
            // No sites found, add the list of sites to the database
            const siteList = ["prestige", "couristan", "fibreworks", "kaya", "bloomsburg", "harcourt", "nourison", "kaleen", "fabrica", "dixie", "masland", "andersontuftex", "wicanders", "shawfloors", "hardwood", "adorra", "rebel", "mohawk"];
            const sitesToAdd = siteList.map(site => ({ site }));
            await siteModel.insertMany(sitesToAdd);

            lastUpdatedSite = await siteModel.findOne().sort({ updatedAt: 1 }).exec();
        }

        // Get the current date
        const currentDate = new Date();

        // Calculate the time difference in milliseconds
        const timeDifference = currentDate - lastUpdatedSite.updatedAt;

        // Convert time difference to days
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        const duration = process.env.CRON_DURATION ?? 7;
        
        // Check if more than one week (7 days) has passed
        if (daysDifference > duration) {
            // Run the scraper function for the site
            await runScraperFunction(lastUpdatedSite.site);

            // Optionally, update the site's updatedAt field to the current date
            lastUpdatedSite.updatedAt = currentDate;
            await lastUpdatedSite.save();
        }

        return res.status(200).json({ message: "Cron scraper executed" });
    } catch (error) {
        console.error("Error in cronScraper:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = {
    getProduct,
    startScraping,
    startScraping1,
    cron,
    getLogs,
    cronScraper
}