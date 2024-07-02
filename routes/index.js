const express = require('express');
const prestigeRoute = require('./prestige/prestige');
const couristanRoute = require('./couristan/couristan');
const fibreRoute = require('./fibre/fibre');
const kayaRoute = require('./kaya/kaya');
const bloomsburgRoute = require('./bloomsburg/bloomsburg');
const harcourtRoute = require('./harcourt/harcourt');
const nourisonRoute = require('./nourison/nourison');
const kaleenRoute = require('./kaleen/kaleen');
const fabricaRoute = require('./fabrica/fabrica');
const dixieRoute = require('./dixie/dixie');
const maslandRoute = require('./masland/masland');
const andersontuftexRoute = require('./andersontuftex/andersontuftex');
const wicandersRoute = require('./wicanders/wicanders');
const shawfloorsRoute = require('./shawfloors/shawfloors');
const hardwoodRoute = require('./hardwood/hardwood');
const adorraRoute = require('./adorra/adorra');
const rebelRoute = require('./rebel/rebel');
const mohawkRoute = require('./mohawk/mohawk');

const app = express();
app.use("/prestige",prestigeRoute);
app.use("/couristan",couristanRoute)
app.use("/fibreworks",fibreRoute)
app.use("/kaya",kayaRoute)
app.use("/bloomsburg",bloomsburgRoute)
app.use("/harcourt",harcourtRoute)
app.use("/nourison",nourisonRoute)
app.use("/kaleen",kaleenRoute)
app.use("/fabrica",fabricaRoute)
app.use("/dixie",dixieRoute)
app.use("/masland",maslandRoute)
app.use("/andersontuftex",andersontuftexRoute)
app.use("/wicanders",wicandersRoute)
app.use("/shawfloors",shawfloorsRoute)
app.use("/hardwood",hardwoodRoute)
app.use("/adorra",adorraRoute)
app.use("/rebel",rebelRoute)
app.use("/mohawk",mohawkRoute)
module.exports = app;


