const adorraGetProductInfo = require("../utils/adorra/getProductInfo")
const adorraGetUrls = require("../utils/adorra/getUrls")
const andersontuftexGetProductInfo = require("../utils/andersontuftex/getProductInfo")
const andersontuftexGetUrls = require("../utils/andersontuftex/getUrls")
const bloomsburgGetProductInfo = require("../utils/bloomsburg/getProductInfo")
const bloomsburgGetUrls = require("../utils/bloomsburg/getUrls")
const couristanGetProductInfo = require("../utils/couristan/getProductInfo")
const couristanGetUrls = require("../utils/couristan/getUrls")
const dixieGetProductInfo = require("../utils/dixie/getProductInfo")
const dixieGetUrls = require("../utils/dixie/getUrls")
const fabricaGetProductInfo = require("../utils/fabrica/getProductInfo")
const fabricaGetUrls = require("../utils/fabrica/getUrls")
const fibreGetProductInfo = require("../utils/fibre/getProductInfo")
const fibreGetUrls = require("../utils/fibre/getUrls")
const harcourtGetProductInfo = require("../utils/harcourt/getProductInfo")
const harcourtGetUrls = require("../utils/harcourt/getUrls")
const hardwoodGetProductInfo = require("../utils/hardwood/getProductInfo")
const hardwoodGetUrls = require("../utils/hardwood/getUrls")
const kaleenGetProductInfo = require("../utils/kaleen/getProductInfo")
const kaleenGetUrls = require("../utils/kaleen/getUrls")
const kayaGetProductInfo = require("../utils/kaya/getProductInfo")
const kayaGetUrls = require("../utils/kaya/getUrls")
const maslandGetProductInfo = require("../utils/masland/getProductInfo")
const maslandGetUrls = require("../utils/masland/getUrls")
const mohawkGetProductInfo = require("../utils/mohawk/getProductInfo")
const mohawkGetUrls = require("../utils/mohawk/getUrls")
const nourisonGetProductInfo = require("../utils/nourison/getProductInfo")
const nourisonGetUrls = require("../utils/nourison/getUrls")
const prestigeGetProductInfo = require("../utils/prestige/getProductInfo")
const prestigeGetUrls = require("../utils/prestige/getUrls")
const rebelGetProductInfo = require("../utils/rebel/getProductInfo")
const rebelGetUrls = require("../utils/rebel/getUrls")
const shawfloorsGetProductInfo = require("../utils/shawfloors/getProductInfo")
const shawfloorsGetUrls = require("../utils/shawfloors/getUrls")
const wicandersGetProductInfo = require("../utils/wicanders/getProductInfo")
const wicandersGetUrls = require("../utils/wicanders/getUrls")


module.exports = (site) => {
    return new Promise(async (resolve, reject) => {
        console.log(`Received ${site} scrapping request via cron`);
        let removed = null;
        try {
            switch (site) {
                case 'prestige':
                    removed = await prestigeGetUrls();
                    if (removed?.isadded > 0) {
                        await prestigeGetProductInfo();
                    }
                    break;
                case 'couristan':
                    removed = await couristanGetUrls();
                    if (removed?.isadded > 0) {
                        await couristanGetProductInfo();
                    }
                    break;
                case 'fibreworks':
                    removed = await fibreGetUrls();
                    if (removed?.isadded > 0) {
                        await fibreGetProductInfo();
                    }
                    break;
                case 'kaya':
                    removed = await kayaGetUrls();
                    if (removed?.isadded > 0) {
                        await kayaGetProductInfo();
                    }
                    break;
                case 'bloomsburg':
                    removed = await bloomsburgGetUrls();
                    if (removed?.isadded > 0) {
                        await bloomsburgGetProductInfo();
                    }
                    break;
                case 'harcourt':
                    removed = await harcourtGetUrls();
                    if (removed?.isadded > 0) {
                        await harcourtGetProductInfo();
                    }
                    break;
                case 'nourison':
                    removed = await nourisonGetUrls();
                    if (removed?.isadded > 0) {
                        await nourisonGetProductInfo();
                    }
                    break;
                case 'kaleen':
                    removed = await kaleenGetUrls();
                    if (removed?.isadded > 0) {
                        await kaleenGetProductInfo();
                    }
                    break;
                case 'fabrica':
                    removed = await fabricaGetUrls();
                    if (removed?.isadded > 0) {
                        await fabricaGetProductInfo();
                    }
                    break;
                case 'dixie':
                    removed = await dixieGetUrls();
                    if (removed?.isadded > 0) {
                        await dixieGetProductInfo();
                    }
                    break;
                case 'masland':
                    removed = await maslandGetUrls();
                    if (removed?.isadded > 0) {
                        await maslandGetProductInfo();
                    }
                    break;
                case 'andersontuftex':
                    removed = await andersontuftexGetUrls();
                    if (removed?.isadded > 0) {
                        await andersontuftexGetProductInfo();
                    }
                    break;
                case 'wicanders':
                    removed = await wicandersGetUrls();
                    if (removed?.isadded > 0) {
                        await wicandersGetProductInfo();
                    }
                    break;
                case 'shawfloors':
                    removed = await shawfloorsGetUrls();
                    if (removed?.isadded > 0) {
                        await shawfloorsGetProductInfo();
                    }
                    break;
                case 'hardwood':
                    removed = await hardwoodGetUrls();
                    if (removed?.isadded > 0) {
                        await hardwoodGetProductInfo();
                    }
                    break;
                case 'adorra':
                    removed = await adorraGetUrls();
                    if (removed?.isadded > 0) {
                        await adorraGetProductInfo();
                    }
                    break;
                case 'rebel':
                    removed = await rebelGetUrls();
                    if (removed?.isadded > 0) {
                        await rebelGetProductInfo();
                    }
                    break;
                case 'mohawk':
                    removed = await mohawkGetUrls();
                    if (removed?.isadded > 0) {
                        await mohawkGetProductInfo();
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            reject(error.message);            
        }
        resolve(removed);
    })
}