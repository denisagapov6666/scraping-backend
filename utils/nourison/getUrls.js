const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "nourison";
let urls = [];
const fetchBrand = async (brandId, brandName, url) => {
    let pageIndex = 1;
    try {
        while (true) {
            const URL = `https://www.nourison.com/carpet${url}?brand=${brandId}&p=${pageIndex}&product_list_limit=72&is_ajax=1`;
            const response = await axios.get(URL);
            const res = response.data;
            const $ = cheerio.load(res.product_list);
            const links = $("a.product-item-link");
            const linksCount = links.length;
            
            if (linksCount > 0) {
                links.each((index, element) => {
                    urls.push($(element).attr("href"));
                });
            } else {
                console.log(`${brandName} - ${linksCount}`);
                break;
            }
            pageIndex++;
        }
    } catch (error) {
        console.error(error);
    }
};
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        // Fetch brands
        await fetchBrand(10028, "HAGAMAN", ""); // 10028 HAGAMAN
        await fetchBrand(5153, "NOURISON", ""); // 5153 NOURISON
        await fetchBrand(5578, "NOURTEX", ""); // 5578 NOURTEX
        const data = await checkUrl(site,urls);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

