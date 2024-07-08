const axios = require('axios');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");

const f = (str) => {
    return str.replace(' ', '-').toLowerCase();
};
const generateUrl = (styleName, styleNumber, colorName, colorNumber) => {
    return `https://andersontuftex.com/carpet/details/${f(styleName)}-${f(styleNumber)}/${f(colorName)}-${f(colorNumber)}`;
};

const site = "andersontuftex";
const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        const response = await axios.get("https://shawfloors.com/api/odata/Carpets?$count=true&$orderby=StyleSequence,UniqueId&$filter=ProductGroupPermanentName%20eq%20%27anderson_tuftex_master%27%20and%20ProductGroupShowOnBrowseCat%20eq%20true%20and%20IsDropped%20eq%20false%20and%20(HasMainImage%20eq%20true)%20and%20(StaticRoomFlag%20eq%20true%20or%20HasRenderImage%20eq%20true)%20and%20(IsDefaultStyleColor%20eq%20true)%20and%20(IsDuplicate%20eq%20false)&$expand=CustomFieldsStyle");
        const carpets = response.data.value;

        const urls = []

        for (const c of carpets) {
            const url = generateUrl(c['SellingStyleName'], c['SellingStyleNbr'], c['SellingColorName'], c['SellingColorNbr']);
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            const colors = $('li.color-thumb a');
            for (const color of colors) {
                urls.push($(color).attr('href'));
                
            }
        }
        const data = await checkUrl(site,urls);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

