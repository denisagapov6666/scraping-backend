const express =  require('express');
const cors = require("cors");
const scarpingConnectDB = require("./config/db");


const app = express();

const routes = require("./routes/index");

// scarping and db connection
scarpingConnectDB();


// cors
app.use(cors());

// initialize middleware
app.use(express.json({ extended: false }));

// use routes
app.use('/', routes);


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
