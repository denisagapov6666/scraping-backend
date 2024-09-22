const LogModel = require("../models/log")
const {broadcast} = require("./pusher");

const leaveLog = async (site, message, history, status) => {
    console.log(site, message)
    await LogModel({ site, history, message, status }).save().then((log) => {
        broadcast(log);
    });
};

const Clog = {
    success: (site, message, history) => {
        leaveLog(site, message, history, 'success');
    },
    error: (site, message, history) => {
        leaveLog(site, message, history, 'error');
    },
    info: (site, message, history) => {
        leaveLog(site, message, history, 'info');
    }
}

module.exports = {
    Clog
}