'use strict';

const express = require('express');
const config = require('./config');
const router = require('./routes/route');
//const mvpList = require('./mvpList');
const fs = require('fs');
const bodyParser = require('body-parser');

let server = express();


//cors allow

server.use((req,res,next)=>{

res.header("Access-Control-Allow-Origin","*");

res.header("Access-Control-Allow-Headers","Origin, X-Requested-With,Content-Type,Accept");

next();

});
// support json encoded bodies
server.use(bodyParser.json());

// support encoded bodies
server.use(bodyParser.urlencoded({ extended: false }));

// use router middleware.
server.use(config.ROUTE_VIRTUAL_DIR + '/', router(config));

// start the server
server.listen(config.SERVER_PORT, () => {
    console.log('service started on port ' + config.SERVER_PORT);
});
