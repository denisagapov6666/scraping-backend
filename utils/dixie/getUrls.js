const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const site = "dixie";

module.exports = async () => {
    console.log("Get Urls:");
    let pageIndex = 1;
    try {
        const urls = []
        while (true) {
            const URL = `https://www.dixie-home.com/collections/carpet?page=${pageIndex}`;
            const response = await axios.get(URL);
            const res = response.data;
            const $ = cheerio.load(res);
            const links = $(".boost-pfs-filter-product-item-image a");
            const linksCount = links.length;
            
            if (linksCount > 0) {
                links.each((index, element) => {
                    const baseurl = $(element).attr("href");
                    const ids = $(element).closest('.boost-pfs-filter-product-item-inner').find('.boost-pfs-filter-product-bottom label');
                    if(ids.length>0){
                        ids.each((index,item) =>{
                            const id = $(item).attr("data-variant-id")
                            urls.push("https://www.dixie-home.com"+baseurl+"?variant="+id)
                        })
                    }
                });
            } else {
                break;
            }
            pageIndex++;
        }
        const data = await checkUrl(site,urls);
        return data;
    } catch (error) {
        console.error(error);
    }
    console.log("End getting Urls:**");
};

