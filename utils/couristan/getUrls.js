const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "couristan";
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    let pageIndex = 1;
    try {
        const urls = [];
        for (let x = 0; x < 99; x++) {
            console.log('fetching page ' + pageIndex);
            const URL = "https://www.couristan.com/wp-admin/admin-ajax.php";
            const form_data = new URLSearchParams();
            form_data.append('action', 'max_filter_products');
            form_data.append('form_data', 'product_tag%3Abroadloom=&paged=' + pageIndex + '&filter-perpage=96&filter-orderby=');

            const response = await axios.post(URL, form_data);
            const $ = cheerio.load(response.data);
            const links = $("div.product-meta a");

            if (links.length > 0) {
                links.each((index, element) => {
                    urls.push($(element).attr('href'));
                });
            } else {
                break;
            }
            pageIndex++;
        }
        return await checkUrl(site,urls)
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

