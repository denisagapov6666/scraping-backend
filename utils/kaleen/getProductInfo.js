const axios = require("axios")
const cheerio = require('cheerio');
const mainGetProducts = require("../MainGetProducts");
// const headers = {
//     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//     'accept-language': 'en-US,en;q=0.9',
//     'cache-control': 'max-age=0',
//     'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-ch-ua-platform': 'Windows',
//     'sec-fetch-dest': 'document',
//     'sec-fetch-mode': 'navigate',
//     'sec-fetch-site': 'none',
//     'sec-fetch-user': '?1',
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
//     'upgrade-insecure-requests': '1'
// };

const { resolve } = require('path');
const scrapeData = (url) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const productSku = $('.fhomename h2').text().trim();
        const productDescription = $('.description-paragraph').text().trim();
        const collection = $('#collectionvariations h2').text().trim();
        
        const featureTags = $('.nectar-fancy-ul ul li');
        const features = { usage: '', width: '', pattern: '', color: '', fiberType: '', construction: '', height: '' };
        
        featureTags.each((index, element) => {
            const text = $(element).text().trim();
            if (text.startsWith('Primary Color:')) {
                features.color = text.replace('Primary Color:', '').trim();
            } else if (text.startsWith('Pattern:')) {
                features.pattern = text.replace('Pattern:', '').trim();
            } else if (text.startsWith('Material:')) {
                features.material = text.replace('Material:', '').trim();
            } else if (text.startsWith('Construction:')) {
                features.construction = text.replace('Construction:', '').trim();
            } else if (text.startsWith('Fiber:')) {
                features.fiberType = text.replace('Fiber:', '').trim();
            } else if (text.startsWith('Indoor / Outdoor:')) {
                features.usage = text.replace('Indoor / Outdoor:', '').trim();
            }
        });
        const sizeElement = $('.size-stock-msrp-table tbody tr td').eq(0).text().trim();
        const [widthStr, heightStr] = sizeElement.split("x");
        const width = widthStr?.trim() ?? '';
        const height = heightStr?.trim().split(/\s+/)[0] ?? '';
        const imageUrls = $('.gallery').map((index, element) => $(element).attr('href')).get();        
        const props = {
            site:"kaleen",
            category:'Carpet',
            brandName: 'Kaleen Broadloom',
            productSku, 
            productName:productSku, 
            productDescription,
            collection, 
            color:features.color, 
            pattern:features.pattern, 
            fiberType:features.fiberType,
            usage:features.usage, 
            construction:features.construction,
            width,
            height,
            imageUrls,

        };
            
        resolve(props)
        
    } catch (error) {
        reject(error);
        console.log('Error fetching URL:', error);
    }
})
module.exports = async() => {
    const site = "kaleen";
    await mainGetProducts.mainGetProducts(site, scrapeData);
}
