const axios = require("axios")
const {checkUrl} = require("../MainCheckUrls");



const site = "hardwood";
const urls= []
const scrapeUrls = async (payload) => {
    try {
        const response = await axios.post("https://www.provenzafloors.com/api/ProductApi/getTileNavigationData",payload );
        response.data.forEach(item => {
            urls.push("https://www.provenzafloors.com" + item.colorUrl);
        });
    } catch (error) {
        console.error('Error fetching URLs:', error);
    }
};
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        await scrapeUrls({"tileType":"LVP","collection":"Uptown Chic"})
        await scrapeUrls({tileType: "Hardwood", manufacturer: "Provenza Floors", collection: "Dutch Masters"})
        console.log(urls)
        const data = await checkUrl(site,urls);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

