'use strict';
const _ = require('underscore');
const express = require('express');
const promise =require('bluebird');
const router = express.Router();
//const mvpList = require('./../mvpList');
const path = require('path');
const basicAuth = require('basic-auth');

module.exports = (config) => {
	const lib = require('../lib/lib')(config);

    // important in order to send request to next middleware...
    router.use((req, res, next) => {
        console.log('Req time: ' + Date.now());
        next();
    });

    function handleError(err, req, res) {

        return res.status(500).send(err || 'Error');
    };

    // route: HTTP POST all routes, pass function name in Body
    router.post("/launchVpod", (req, res) => {
		req.setTimeout(0)
        if(!req.body && (!req.body.username) && (!req.body.stack) && (!req.body.instanceType) && (!req.body.duration) && (!req.body.scheduler) ) {
            return res.status(400).send("missing inputs");
        }
        console.log("req.body.username : ", req.body.username);
        console.log("req.body.stack : ", req. body.stack);
        console.log("req.body.instanceType : ", req.body.instanceType);
        console.log("req.body.duration : ", req.body.duration);
        console.log("req.body.scheduler : ", req.body.scheduler);

        return lib.launchVpod(req.body.username,req.body.stack,req.body.instanceType,req.body.duration,req.body.scheduler)
            .then((result)=>{
                        res.send({'result': result});
            })
            .catch((err)=> {
                return res.status(500).send(err || "Error");
            });
         
	});
	
    router.delete("/destroyVpod", (req, res) => {
        
        if(!req.body && (!req.body.username) && (!req.body.stack) && (!req.body.instanceType) && (!req.body.duration) && (!req.body.scheduler) ) {
            return res.status(400).send("missing inputs");
        }
        console.log("req.body.username : ", req.body.username);
        console.log("req.body.stack : ", req. body.stack);
        console.log("req.body.instanceType : ", req.body.instanceType);
        console.log("req.body.duration : ", req.body.duration);
        console.log("req.body.scheduler : ", req.body.scheduler);

        return lib.destroyVpod(req.body.username,req.body.stack,req.body.instanceType,req.body.duration,req.body.scheduler)
            .then((result)=>{
                    res.send(result);
            })
            .catch((err)=> {
                return res.status(500).send(err || "Error");
            });
                 
	});
	

	
    return router;
};
