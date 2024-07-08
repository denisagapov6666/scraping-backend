const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "adorra";
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        const URL = "https://www.adorracarpet.com/";
        const response = await axios.get(URL);
        const $ = cheerio.load(response.data)
        const products = $('div.product-details');
        const urls = [];
        products.each((index, element) => {
            const title = $(element).find('div.product-name span').first().text();
            const colors = $(element).find('div.product-colors-variant-images img');
    
            colors.each((i, img) => {
                const color = $(img).attr('data-color');
                urls.push("https://www.adorracarpet.com/?" + title + "-" + color)
            });
        });
        const data = await checkUrl(site,urls);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

