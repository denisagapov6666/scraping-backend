const axios = require('axios');
const cheerio = require('cheerio');
const {mainGetProducts} = require("../MainGetProducts");

const { resolve } = require('path');
const scrapeData = (url) => new Promise(async (resolve, reject) => {
    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        const productName = $('div.pdp-content h3').first().text();
        const texture = $('#pdpdata-texture').text();
        const design = $('#pdpdata-design').text();
        const fiberType = $('#pdpdata-fiber_content').text();
        const construction = $('#pdpdata-construction').text();
        const origin = $('#pdpdata-country_of_origin').text();
        const width = $('#pdpdata-repeat_width_length').text();
        const rollWidth = $('#pdpdata-roll_width').text();
        const repeatWidth = $('#pdpdata-repeat_width').text();
        const repeatLength = $('#pdpdata-repeat_length').text();
        const collection = $('.detail-value').first().text();

        const variants = $('div.variant-item a');
        let retValue = [];

        for (let i = 0; i < variants.length; i++) {
            const productSku = variants.eq(i).attr('data-api-sku');
            const color = variants.eq(i).attr('data-color-name');
            const api = variants.eq(i).attr('data-api-feature_image');

            const imageUrl = api.replace("?$med_thumb$", "_SET?req=set,json,UTF-8");
            const imageRes = await axios.get(imageUrl);
            const imageData = imageRes.data;
            const start_index = imageData.indexOf('(') + 1;
            const end_index = imageData.lastIndexOf(')') - 3;
            const json_data = imageData.substring(start_index, end_index);
            const parsed_data = JSON.parse(json_data);
            const props = {
                site:"prestige",
                category: "CARPET",
                brandName: "PRESTIGEMILLS",
                productSku,
                productName,
                collection,
                color,
                texture,
                design,
                fiberType,
                construction,
                origin,
                width,
                repeatWidth,
                repeatLength,
                rollWidth,
            };

            try {
                if (parsed_data.set && parsed_data.set.item && Array.isArray(parsed_data.set.item)) {
                    const images = parsed_data.set.item;
                    const width = "642";
                    const imageUrls = images.map(image => {
                        const height = Math.floor((642 * image.dy) / image.dx);
                        return `https://s7d2.scene7.com/is/image/${image.i.n}?wid=${width}&hei=${height}`;
                    })
                    props.imageUrls = imageUrls;
                } else {
                    props.imagesUrls = api;
                }
                retValue.push(props)
                if (i === variants.length - 1) resolve(retValue);
            } catch (error) {
                reject(error);
                console.log('Error parsing images:', error);
            }
        }
    } catch (error) {
        reject(error);
        console.log('Error fetching URL:', error);
    }
})

module.exports = async() => {
    const site = "prestige";
    await mainGetProducts(site,scrapeData);
}