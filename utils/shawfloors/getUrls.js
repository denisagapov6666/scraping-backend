const axios = require('axios');
const {checkUrl} = require("../MainCheckUrls");
const site = "shawfloors"
const { Clog } = require('../utils');

const f = (str) => {
    return str.replace(/ /g, '-').replace("'","-").toLowerCase();
};
const generateUrl = (styleName, styleNumber, colorName) => {
    return `https://shawfloors.com/flooring/carpet/details/${f(styleName)}-${f(styleNumber)}/${f(colorName)}`;
};
module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const response = await axios.get("https://shawfloors.com/api/odata/Carpets?$count=true&$orderby=StyleSequence,UniqueId&$filter=ProductGroupPermanentName%20eq%20%27shawfloors%27%20and%20ProductGroupShowOnBrowseCat%20eq%20true%20and%20IsDropped%20eq%20false%20and%20(IsDefaultStyleColor%20eq%20true)%20");
        const carpets = response.data.value;
        const uus = [];
        for (const c of carpets) {
            const url = "https://shawfloors.com/api/odata/carpets?$filter=SellingStyleNbr%20eq%20%27"+c['SellingStyleNbr']+"%27%20and%20IsDropped%20eq%20false%20and%20ProductGroupPermanentName%20eq%20%27shawfloors%27&$orderby=ColorSequence&$expand=CustomFieldsStyle,CustomFieldsColor,ImageInfo";
            const urlElement = await axios.get(url);
            const urls = urlElement.data.value;
            for (const curl of urls) {
                const u = generateUrl(curl['SellingStyleName'], curl['SellingStyleNbr'], curl['SellingColorName']);
                uus.push(u)   
            }
        }
        const data = await checkUrl(site,uus);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};