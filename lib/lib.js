'use strict';
const promise = require('bluebird');
const request = require("request-promise");
const shell = promise.promisifyAll(require('shelljs'));
const _ = require('underscore');
const config = require("../config");
var AWS = require("aws-sdk");
var nano= require("nano");


module.exports =  (config)=>{

    var launchVpod = (username,stack,instanceType,duration,scheduler)=> {
            var dir = process.cwd();
            var private_ip;
            var nano = require("nano")('http://localhost:5984');
            stack = config[stack]
            console.log(stack);
            var s3 = new AWS.S3({
                //accessKeyId: config.accessKeyId,
                //secretAccessKey: config.secretAccessKey
                //region: 'us-east-1'
            });
            var cmd1 = 'cd VPOD && echo "no" | terraform init -backend-config="key='+username+'/terraform.tfstate"';
            return shell.execAsync(cmd1)
            .then((result)=>{
                console.log(process.cwd());
                //console.log(cmd1);
                //console.log("Successfully created folder");
                return promise.resolve("Terraform Initialized");
            })
            .then(()=>{
                var cmd2 = "cd "+dir+"/VPOD && terraform apply -auto-approve -var 'username="+""+username+"' -var 'instanceType="+""+instanceType+"' -var 'scheduler="+""+scheduler+"' -var 'stack="+""+stack+"'  -var 'duration="+""+duration+"'";
                return shell.execAsync(cmd2)
            })
            .then((result)=>{
                console.log("*********************terraform result********************",result);
              
                return promise.resolve("VPOD Launched Successfully."); 
                
            })
            .then(()=>{
                return new promise(function(resolve,reject){
                    var params = {
                        Bucket: 'vpod',
                        Key: username+"/terraform.tfstate"
                    }
                    s3.getObject(params, function(err, data) {
                        if (err)
                            return err;
                           var  output = JSON.parse(data.Body.toString());
                         //console.log(output.modules[0].resources["aws_db_instance.rdsInstance"].primary.attributes.address);
                         resolve(output);
                        });
                 })   
               //return fs.readFileAsync(dir+'/'+provider+'/'+name+'/terraform.tfstate')
                .then((result)=>{
                    var tfStateoutput = result;
                    console.log(tfStateoutput);
                    private_ip=tfStateoutput.modules[0].resources["aws_instance.UserInstance"].primary.attributes.private_ip;
                    console.log(private_ip);
                })
            })
            .then(()=> {
                var alice = nano.db.use("vpod");
                var params = {
                    "username":username,
                    "stack":stack,
                    "instanceType":instanceType,
                    "duration":duration,
                    "scheduler":scheduler,
                    "private_ip":private_ip
                    }
                   return new promise(function(resolve,reject){
                    alice.insert(params,function(err) {
                    if (err)
                  {
           reject("error error");
                    console.log("error")
                  }

                     console.log(params)
                     resolve(params)
               });
              
            
        })
    })
            
            .then(()=>{
                AWS.config.update({"region": "us-west-2"});
               // username =JSON.parse(username)
                var lambda = new AWS.Lambda();
                var params = {
                FunctionName: 'ses' /* required */,
                Payload:'{"client_id":'+'"'+username+'@virtusa.com","private_ip":'+'"'+private_ip+'"}'/* required */
                };
                console.log(params);
                lambda.invoke(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     
                console.log(data);           // successful response
                });
        
            })
            .catch((err)=>{
                return promise.reject(err);
            });
        
    };


    var destroyVpod = (username,stack,instanceType,duration,scheduler)=> {
            var dir = process.cwd();
            var cmd1 = 'cd VPOD && echo "no" | terraform init -backend-config="key='+username+'/terraform.tfstate"';
            return shell.execAsync(cmd1)
        .then((result)=>{
            console.log(process.cwd());
            return promise.resolve("Initialized");
        })
        .then(()=>{
            var cmd2 = "cd "+dir+"/VPOD && terraform destroy -force -var 'username="+""+username+"' -var 'instanceType="+""+instanceType+"' -var 'scheduler="+""+scheduler+"' -var 'stack="+""+stack+"'  -var 'duration="+""+duration+"'";
            return shell.execAsync(cmd2)
        })
        .then(()=>{
            return promise.resolve("Instance deleted");
        })
        .catch((err)=>{
            return promise.reject(err);
        });
        
    };
    return {
        "launchVpod": launchVpod,
        "destroyVpod":destroyVpod   
    };
};
