const axios = require('axios');
const { checkUrl } = require("../MainCheckUrls");
const site = "rebel";
module.exports = async () => {
    console.log("Get Urls:");
    try {
        // Fetch URLs from the homepage
        const url = "https://www.rebelcarpets.com/pro-gallery-webapp/v1/galleries/1c1a8969-d8b2-4986-985a-23f61025b604?externalId=654e06a6-897c-450d-949f-d8a634b29636&state=PUBLISHED&lang="

        const headers = {
            "Authorization": "yrRasmx4IcC89A-T4Pe1cYTvajMTmJGCyXwHP97urqY.eyJpbnN0YW5jZUlkIjoiNWVlYTM5NjktYjEzOS00NDA3LTlhMjMtMDc0NGU0NmE1MjNhIiwiYXBwRGVmSWQiOiIyMmJlZjM0NS0zYzViLTRjMTgtYjc4Mi03NGQ0MDg1MTEyZmYiLCJtZXRhU2l0ZUlkIjoiNWVlYTM5NjktYjEzOS00NDA3LTlhMjMtMDc0NGU0NmE1MjNhIiwic2lnbkRhdGUiOiIyMDI0LTA3LTAzVDA4OjUyOjQ3LjIyNFoiLCJkZW1vTW9kZSI6ZmFsc2UsImFpZCI6IjcwMTUzMjdmLWVlNWUtNDdlMi05YTQyLWFjYjQyYTk5Mjc1ZCIsInNpdGVPd25lcklkIjoiMjEzM2EzZTMtNzJmNC00ODhkLWI2MGMtYTZkYWYxNTI0NTQ3In0"
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
        console.error('Error fetching URLs:', error);
    }
    console.log("End getting Urls:**")
};

