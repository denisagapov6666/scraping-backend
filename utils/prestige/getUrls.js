const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "prestige";
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        // Fetch URLs from the homepage
        const URL = "https://www.prestigemills.com/products-collection.html";
        const response = await axios.get(URL);
        const $ = cheerio.load(response.data);
        const links = $(".product-feature .product-link");

        if (links.length > 0) {
            const urlsInLinks = links.toArray().map(element => $(element).attr('href'));

            // Check and update URLs in the database
            const data = await checkUrl(site,urlsInLinks);
            return data;
            // const test = [
            // "https://www.prestigemills.com/wallace-tartan"];
            // await checkUrl(test);
        }
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

