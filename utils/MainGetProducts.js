const URLModel = require('../models/urls');
const Product = require('../models/products');

const mainGetProducts = (site, scrapeData) => {
    console.log('Get Product Info:');
    return new Promise(async resolve => {
        try {
            const allUrlModels = await URLModel.find({site, new: true });
            let count = 0;
            const scrapingOneUrl = async (i) => {
                console.log(allUrlModels[i].url)
                const products = await scrapeData(allUrlModels[i].url)
                await Product.deleteMany({url: allUrlModels[i]._id});

                if(products){
                    if(Array.isArray(products)){
                        products.forEach(async product => {
                            const newProduct = new Product({ ...product, url: allUrlModels[i]._id });
                            await newProduct.save().then(() => console.log(`${++count} product is saved.`));
                        })
                    } else {
                        const newProduct = new Product({ ...products, url: allUrlModels[i]._id });
                        await newProduct.save().then(() => console.log(`${++count} product is saved.`));
                    }
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
                console.log("end");
                resolve();
            }
        } catch (error) {
            console.log("Error fetching URL:", error);
        }
    })

}
module.exports = {
    mainGetProducts
}