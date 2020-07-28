require("dotenv").config({path: ".env"});

const express = require("express");

const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const routes = require("./src/routes");

const loopBack = require("./src/loop.back");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", routes);

app.listen(process.env.PORT || 3000, () => {

    console.log(`start server on port: ${process.env.PORT} (default: 3000)`);

    loopBack.init();

});



module.exports = app;