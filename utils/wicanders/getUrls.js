const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const {checkUrl} = require("../MainCheckUrls");
const { Clog } = require('../utils');
const site = "wicanders";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const urls= []
const scrapeUrls = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set a higher timeout if necessary
        await page.setDefaultNavigationTimeout(0);

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the "Load More" button to become visible
        const buttonstate = await page.waitForSelector('.more-products--btn', { visible: true })
            .then(() => true)
            .catch(error => {
                console.log("Button not found on page:", url);
                return false;
            });
        
        // Accept Cookie
        await page.evaluate(() => {
            // Access the shadow DOM inside #usercentrics-root
            const shadowHost = document.querySelector('#usercentrics-root');
            if (shadowHost) {
                const shadowRoot = shadowHost.shadowRoot;
                
                // Find the accept cookie button within the shadow DOM
                const acceptCookieBtn = shadowRoot.querySelector('.gXQgus');
                
                // Click the button
                if (acceptCookieBtn) {
                    acceptCookieBtn.click();
                }
            }
        })

        await delay(1000);

        // Click the "Load More" button
        if(buttonstate){

            await page.click('.more-products--btn');

            // Wait for some time for the new content to load
            await delay(5000); // Adjust the wait time as necessary
        }

        const html = await page.content(); // Get the rendered HTML content
        await browser.close();

        const $ = cheerio.load(html);
        const links = $(".product-item a");

        links.each((index, element) => {
            urls.push($(element).attr('href'));
        });

    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        // Fetch brands
        await scrapeUrls("https://www.wicanders.us/products/cork-66")
        await scrapeUrls("https://www.wicanders.us/products/wood-67")
        await scrapeUrls("https://www.wicanders.us/products/stone-68")
        console.log(urls);
        const data = await checkUrl(site,urls);
        return data;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

