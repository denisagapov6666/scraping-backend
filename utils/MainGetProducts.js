const URLModel = require('../models/urls');
const Product = require('../models/products');
const { Clog } = require('./utils');

const mainGetProducts = (site, scrapeData) => {
    return new Promise(async resolve => {
        try {
            Clog.info(site, `Now we are fetching new products info one by one...`);
            const allUrlModels = await URLModel.find({site, new: true });
            let count = 0;
            const scrapingOneUrl = async (i) => {
                Clog.info(site, `fetching - ${allUrlModels[i].url}`)
                
                try {
                    const products = await scrapeData(allUrlModels[i].url)
                    await Product.deleteMany({url: allUrlModels[i]._id});
    
                    if(products){
                        if(Array.isArray(products)){
                            Clog.info(site, `We found ${products.length} variants in ${allUrlModels[i].url}`);
                            products.forEach(async product => {
                                const newProduct = new Product({ ...product, url: allUrlModels[i]._id });
                                await newProduct.save().then(() => console.log(`${++count} product is saved.`));
                            })
                        } else {
                            const newProduct = new Product({ ...products, url: allUrlModels[i]._id });
                            await newProduct.save().then(() => console.log(`${++count} product is saved.`));
                        }
                    }
                } catch(error) {
                    Clog.error(site, `error fetching product - ${allUrlModels[i].url} - ${error.message}`);
                }
                
                if (i < allUrlModels.length-1) {
                    scrapingOneUrl(i + 1);
                } else {
                    resolve();
                }
    
            }
            if (allUrlModels.length > 0) {
                scrapingOneUrl(0);
            } else {
                resolve();
            }
        } catch (error) {
            Clog.error(site,`Error fetching products - ${error.message}`);
        }
    })

}
module.exports = {
    mainGetProducts
}