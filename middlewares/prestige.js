const requestUrl = require("../models/RequestModel");

const isScrapingByOtherUser = async (req, res, next) => {
    try {
        // Check if the URL exists in the database
        const existUrlState = await requestUrl.findOne({ url: req.url });

        // If the URL doesn't exist, create a new document for it
        if (!existUrlState) {
            await new requestUrl({ url: req.url, state: false }).save();
        }

        // Check if any URL is currently being scraped
        const isScraping = await requestUrl.findOne({ state: true });
        if (isScraping) {
            const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
            if (isScraping.updatedAt < thirtyMinsAgo) {
                // More than 30mins have passed since the started scraping
                // stop here?
            } else {
                return res.status(200).json({ success: false, message: 'Another user or process is currently scraping. Please wait.' });
            }
        }

        // Update the state of the current URL to indicate scraping in progress
        await requestUrl.findOneAndUpdate({ url: req.url }, { state: true });

        // Proceed to the next middleware or route handler
        await next();

        // Reset the state of the URL after scraping is finished
    } catch (error) {
        console.error('Error in isScrapingByOtherUser middleware:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    isScrapingByOtherUser
}
