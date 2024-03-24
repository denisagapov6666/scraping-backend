const getProductInfo = require('../utils/masland/getProductInfo');
const getUrls = require('../utils/masland/getUrls');
const CronJob = require("./cronjob");

const site = "masland";
const schedule = "11 * * * 6";

const maslandCronJob = () => {
    CronJob.CronJob(site,schedule, getProductInfo,getUrls)
}
module.exports = {
    maslandCronJob
}