const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "kaleen";
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        const URL = "https://www.kaleen.com/rugs/kaleen/";
        const response = await axios.get(URL);
        const $ = cheerio.load(response.data);
        const links = $(".collectionlist .kalcollections a");
        const kurls = [];

        if (links.length > 0) {
            for (let i = 0; i < links.length; i++) {
                const collectionUrl = links.eq(i).attr('href');
                const collectionResponse = await axios.get(collectionUrl);
                const $collection = cheerio.load(collectionResponse.data);
                const urls = $collection("#collection .cvariation a");
                if (urls.length > 0) {
                    const productUrls = urls.toArray().map(element => $(element).attr("href"));
                    for (let j = 0; j < productUrls.length; j++) {
                        const productUrl = productUrls[j];
                        try {
                            const productResponse = await axios.get(productUrl);
                            const $product = cheerio.load(productResponse.data);
                            const productLinks = $product(".product-table a");
                            if (productLinks.length > 0) {
                                productLinks.toArray().forEach(element => kurls.push($(element).attr("href")));
                            }
                        } catch (error) {
                            console.error('Error fetching product URLs:', error);
                        }
                    }
                }
            }
        }
        const data = await checkUrl(site,kurls);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

