const URLModel = require('../models/urls');
const ProductModel = require('../models/products');
const HistoryModel = require("../models/history");
const { Clog } = require('./utils');
const checkUrl = (site,newUrls) => new Promise(async (resolve, reject) => {
    Clog.info(site, `Found total ${newUrls.length} products in ${site}. comparing with db...`);
    try {
        const allUrlModels = await URLModel.find({site}).select('url deleted');
        const alreadyDeletedCount = allUrlModels.filter(u => u.deleted).length;
        const previousDeletedUrlsSet = new Set(allUrlModels.filter(u => u.deleted).map(u => u.url));
        const allUrlsSet = new Set(allUrlModels.map(urlModel => urlModel.url));
        const newUrlsSet = new Set(newUrls);
        
        const removedUrls = [...allUrlsSet].filter(url => !newUrlsSet.has(url) && !previousDeletedUrlsSet.has(url));
        const addedUrls = [...newUrlsSet].filter(url => !allUrlsSet.has(url));

        let removedProductsLength = removedUrls.length;
        
        if(removedUrls.length > 0){
            await URLModel.updateMany(
                { url: { $in: removedUrls } }, 
                { $set: { new: false, deleted: true } }
            );
        }
     
        if(addedUrls.length > 0){
            await URLModel.updateMany({ site, new: true }, { $set: { new: false } });
            // Add new URLs to the database
            const newUrlModels = addedUrls.map(url => ({
                site,
                url,
                new: true,
                deleted: false
            }));
            await URLModel.insertMany(newUrlModels);
        }

        if(addedUrls.length > 0 || removedProductsLength > 0){
            Clog.info(site, `There are new ${addedUrls.length} urls and removed ${removedProductsLength} urls in ${site}`);
            await new HistoryModel({site, added: addedUrls.length, removed: removedProductsLength}).save()
        } else {
            Clog.info(site, `There is not any new or removed products in ${site}`);
        }
        
        resolve({removed:removedProductsLength,isremoved:removedProductsLength,isadded:addedUrls.length})
    } catch (error) {
        Clog.error(site, 'Error updating URLs in database: ' + error.message);
    }
})
const checkUrl1 = (site, count, newUrls) => new Promise(async (resolve, reject) => {
    try {
        const allUrlModels = await URLModel.find({site});
        const alreadyDeletedCount = allUrlModels.filter(u => u.deleted).length;
        const allUrls = allUrlModels.map(urlModel => urlModel.url);
        const removedUrls = allUrls.filter(url => !newUrls.includes(url));

        let removedProductsLength = 0;

        if(removedUrls.length > 0){
            // Update existing URLs in the database
            await Promise.all(allUrlModels.map(async urlModel => {
                if (removedUrls.includes(urlModel.url)) {
                    const products = await ProductModel.find({ url: urlModel._id });
                    removedProductsLength += products.length;
                    await URLModel.findByIdAndUpdate(urlModel._id, { new: false, deleted: true });
                }
            }));
        }

        removedProductsLength -= alreadyDeletedCount;
        if(count > 0 || removedProductsLength > 0) {
            Clog.info(site, `Added new ${addedUrls.lenght} products and removed ${removedProductsLength} products in ${site}`);
            await new HistoryModel({site, added: count, removed: removedProductsLength}).save()
        } else {
            Clog.info(site, `Not found any new and removed products in ${site}`);
        }

        resolve({removed:removedProductsLength,isremoved:removedProductsLength,isadded:count})
    } catch (error) {
        Clog.error(site, 'Error updating URLs in database: ' + error.message);
    }
})
module.exports = {
    checkUrl,
    checkUrl1
}