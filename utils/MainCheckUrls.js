const URLModel = require('../models/urls');
const ProductModel = require('../models/products');
const HistoryModel = require("../models/history");
const checkUrl = (site,newUrls) => new Promise(async (resolve, reject) => {
    try {
        const allUrlModels = await URLModel.find({site}).select('url deleted');
        const allUrlsSet = new Set(allUrlModels.map(urlModel => urlModel.url));
        const newUrlsSet = new Set(newUrls);
        
        const removedUrls = [...allUrlsSet].filter(url => !newUrlsSet.has(url));
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

        if(addedUrls.length > 0 || removedUrls.length > 0){
            console.log({site: site, added: addedUrls.length, removed: removedUrls.length})
            await new HistoryModel({site}).save()
        }
        
        resolve({removed:removedProductsLength,isremoved:removedUrls.length,isadded:addedUrls.length})
    } catch (error) {
        console.error('Error updating URLs in database:', error);
    }
})
const checkUrl1 = (site, count,newUrls) => new Promise(async (resolve, reject) => {
    try {
        const allUrlModels = await URLModel.find({site});
        const allUrls = allUrlModels.map(urlModel => urlModel.url);

        const removedUrls = allUrls.filter(url => !newUrls.includes(url));

        let removedProductsLength = 0;
        if(removedUrls.length>0){
            // Update existing URLs in the database
            await Promise.all(allUrlModels.map(async urlModel => {
                if (removedUrls.includes(urlModel.url)) {
                    const products = await ProductModel.find({ url: urlModel._id });
                    removedProductsLength += products.length;
                    await URLModel.findByIdAndUpdate(urlModel._id, { new: false, deleted: true });
                }
            }));
        }
        if(count>0||removedUrls.length>0){
            await new HistoryModel({site}).save()
        }


        resolve({removed:removedProductsLength,isremoved:removedUrls.length,isadded:count})
    } catch (error) {
        console.error('Error updating URLs in database:', error);
    }
})
module.exports = {
    checkUrl,
    checkUrl1
}