const axios = require('axios');
const cheerio = require('cheerio');
const mainGetProducts = require("../MainGetProducts");

const { resolve } = require('path');
const formatString = (str) => str.replace(/\t|\n/g, '').replace(/\s{2,}/g, ' ');
const scrapeData = (url) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const productName = formatString($('h1.product_title').text());
        const brandName = formatString($('li.pa_brand span.product-attribute-values').text());
        const productSku = formatString($('li.product-sku span.product-attribute-values').text());
        const collection = formatString($('span.product-pattern-name').text());
        const color = formatString($('li.pa_color span.product-attribute-values').text());
        const width = formatString($('li.pa_width span.product-attribute-values').text());
        const weave = formatString($('li.pa_weave span.product-attribute-values').text());
        const yarn = formatString($('li.pa_yarn span.product-attribute-values').text() || $('li.Yarn span.product-attribute-values').text());
        const backing = formatString($('li.pa_backing-material span.product-attribute-values').text());
        const construction = formatString($('li.pa_construction span.product-attribute-values').text());
        const fireRating = formatString($('li.pa_fire-rating span.product-attribute-values').text());
        const weight = formatString($('li.pa_pile-weight span.product-attribute-values').text());
        const repeatWidth = formatString($('li.pa_repeat span.product-attribute-values').text());
        
        // Get image URLs
        const imageUrls = [];
        const images = $('div.slide-image img');
        images.each((index, element) => {
            if ($(element).attr('data-lazy-srcset')) {
                imageUrls.push($(element).attr('data-lazy-srcset').split(" ")[0]);
            } else {
                imageUrls.push($(element).attr('srcset').split(" ")[0]);
            }
        });
        const props = {
            category:'CARPET',
            brandName, 
            productSku, 
            productName, collection,
            color, 
            width, 
            weave, 
            yarn, 
            backing, 
            construction, 
            fireRating, 
            weight, 
            repeatWidth, 
            imageUrls,
            site:"bloomsburg"
        };
        resolve(props)
    } catch (error) {
        // reject(error);
        resolve(null);
        console.error('Error fetching URL:', error);
    }
})

module.exports = async() => {
    const site = "bloomsburg";
    await mainGetProducts.mainGetProducts(site,scrapeData);
}
