const axios = require('axios');
const { checkUrl } = require("../MainCheckUrls");
const site = "rebel";const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        // Fetch URLs from the homepage
        const url = "https://www.rebelcarpets.com/pro-gallery-webapp/v1/galleries/1c1a8969-d8b2-4986-985a-23f61025b604?externalId=654e06a6-897c-450d-949f-d8a634b29636&state=PUBLISHED&lang="
        const access_token_url = "https://www.rebelcarpets.com/_api/v1/access-tokens";

        const access_response = await axios.get(access_token_url);
        const token = access_response.data.svSession;
        
        const headers = {
            'cookie': 'svSession='+token+';'
        }

        const response = await axios.get(url, {headers});
        const items = response.data.gallery.items

        const urls = []
        if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const collectionUrl = items[i].link.url;
                urls.push(collectionUrl);
            }
        }
        const data = await checkUrl(site, urls);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

