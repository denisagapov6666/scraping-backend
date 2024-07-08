const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "bloomsburg";
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)

    let pageIndex = 1;
    const urls = [];
    try {
        while (true) {
            const URL = `https://bloomsburgcarpet.com/products-list/page/${pageIndex}`;
            const response = await axios.get(URL);
            
            // Check if response status is 404
            if (response.status === 404) {
                console.log(`Page ${pageIndex} not found. Exiting loop.`);
                break;
            }
            
            const $ = cheerio.load(response.data);
            const links = $(".fl-post-add-to-cart a");

            if (links.length > 0) {
                links.each((index, element) => {
                    const url = $(element).attr('href');
                    urls.push(url);
                });
                pageIndex++;
            } else {
                break;
            }
        }
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
    return await checkUrl(site,urls)
};

