const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "fibre";
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        // Fetch URLs from the homepage
        const URL = "https://fibreworks.com/collections/view-all/";
        const response = await axios.get(URL);
        const $ = cheerio.load(response.data);
        const links = $(".collection__colors .color__item a");

        if (links.length > 0) {
            const urlsInLinks = links.toArray().map(element => "https://fibreworks.com"+$(element).attr('href'));
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

