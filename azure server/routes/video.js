
const express = require("express");
const router = express.Router();

const os = require("os");
const async = require('async');
const util = require('util');
const uuidv4 = require('uuid/v4');
const path = require('path');
const url = require('url');
const fs = require('fs');
const fetch = require('node-fetch');
const MediaServices = require('azure-arm-mediaservices');
const msRestAzure = require('ms-rest-azure');
const msRest = require('ms-rest');
const azureStorage = require('azure-storage');

// credentials
const armAadAudience = "https://management.core.windows.net/";
const AadTenantDomain = "anasm9877gmail.onmicrosoft.com"
const aadEndpoint = "https://login.microsoftonline.com/"; 
const armEndpoint = "https://management.azure.com/";
const subscriptionId = "5f3f711c-c648-4839-8dd8-9315e520d85f";
const accountName ="abc";
const location ="East US";
const aadClientId = "3e1769df-a14c-4f58-b4b1-c48c69a1dc60";
const aadSecret ="-tv9_8m_Q50-i-8XiIaCyO0a125f44bkWr";
const aadTenantId ="f4d674fc-3ec6-4a06-af9c-0285598e415a";
const resourceGroup ="abc";
const outputFolder = "Temp";
// end


let azureMediaServicesClient;


msRestAzure.loginWithServicePrincipalSecret(aadClientId, aadSecret, aadTenantId, {
    environment: { 
      activeDirectoryResourceId: armAadAudience,
      resourceManagerEndpointUrl: armEndpoint,
      activeDirectoryEndpointUrl: aadEndpoint  
    }
  }, async function(err, credentials, subscriptions) {
    // console.log("credentials",credentials)
      if (err){
        return console.log("=>>>",err)
      } ;
      azureMediaServicesClient = new MediaServices(credentials, subscriptionId, armEndpoint, { noRetryPolicy: true });
      console.log("connected to azure");
})
router.use("/startLiveStream",async function(req,res){
    
    let uniqueness  = uuid()
    const namePrefix = "pledge"
    let outputLiveStreamName = namePrefix + '-' + uniqueness;
    outputLiveStreamName = outputLiveStreamName.slice(0,32)

    
    // console.log("creating live stream...",uniqueness)
    // let liveEventCreate = await liveEventCreator(resourceGroup, accountName, outputLiveStreamName, uniqueness)

    outputLiveStreamName = "pledge-8fd096a0-b0b3-43d6-986f-9"

    console.log("live event start.")
    let liveEventStart = await liveEventStarter(resourceGroup, accountName, outputLiveStreamName)
    // console.log(liveEventStart)

    // console.log("getting endpoints",uniqueness)
    // getStreamingEndpoint(resourceGroup, accountName, uniqueness)
})
async function startingEndpoint(resourceGroupName, accountName, streamingEndpointName="default"){
    return await azureMediaServicesClient.streamingEndpoints.start(resourceGroupName, accountName, streamingEndpointName,{
        location,
        scaleUnits : 2
    })
    // .then(res=> console.log("endpoint ",res))
    // .catch(err => console.log("endpoint err ",err)) 
    
}
async function liveEventStoper(resourceGroup, accountName, liveEventName, parameters){
    return await azureMediaServicesClient.liveEvents.stop(resourceGroup, accountName, liveEventName,{
      removeOutputsOnStop : true
    })
}
async function getLiveEvent(resourceGroup, accountName, liveEventName){
    return await azureMediaServicesClient.liveEvents.get(resourceGroup, accountName, liveEventName)
}
async function createStreamLocator(resourceGroupName, accountName, liveEventName){ 
    return await azureMediaServicesClient.streamingLocators.create(resourceGroupName, accountName, liveEventName,{
        assetName : liveEventName,
        streamingPolicyName : "Predefined_ClearStreamingOnly"
    } )
}
async function liveEventStarter(resourceGroup, accountName, liveEventName){
    const a =  await azureMediaServicesClient.liveEvents.start(resourceGroup, accountName,liveEventName)
    console.log("getting live event")
    const b =  await getLiveEvent(resourceGroup, accountName, liveEventName)
    .then(res=> console.log("res ",res,"\n input endpoints = ",res.input.endpoints,"\n output endpoints = ",res.preview.endpoints))
    .catch(err => console.log("err ",err)) 
    console.log("starting endpoint")
    const endpoint = await startingEndpoint(resourceGroup, accountName)
    console.log("endpoint",endpoint)
    console.log("creating stream locator")
    const locator =  await createStreamLocator(resourceGroup, accountName, liveEventName)
    console.log("locator = ",locator)
      
    // console.log("a ",a)
    // return a
}
async function liveEventCreator(resourceGroup, accountName, liveEventName, uuidd){
    // rtmp://d5f0f4e2286548b2bbe62000eac17bd4.channel.media.azure.net:1935/live/e9094c5f7703428bba6b97f5e0b743c6
    // rtmp://d5f0f4e2286548b2bbe62000eac17bd4.channel.media.azure.net:1935/live/e9094c5f7703428bba6b97f5e0b743c6
    // rtmp://d5f0f4e2286548b2bbe62000eac17bd4.channel.media.azure.net:1935/live/ba167e628d53432d8cefd53d35be1fbc
    // rtmp://b3266b86376f46bba75f08048ece7259.channel.media.azure.net:1935/live/bb5d4f3d9e164c0f9be19453633606cc
    // rtmp://8826a9545cc2409ca7b968b0fb682ef5.channel.media.azure.net:1935/live/8fd096a0b0b343d6986f95425686cbe5
    // let uniqueness1 = uuid()
    // let uniqueness2 = uuid()
    // let uniqueness3 = uuid()
    // console.log("uuid \n",uniqueness1,"\n",uniqueness2)
    return  await azureMediaServicesClient.liveEvents.create(resourceGroup, accountName, liveEventName,{
        location ,
        input : {
            accessControl : "ip",
            accessToken : uuidd, 
            // keyFrameIntervalDuration : "PT2S",
            streamingProtocol : "RTMP",
            endpoints : [
                //  {
                //      protocol : "RTMP",
                //      url : "rtmp://b3266b86376f46bba75f08048ece7259.channel.media.azure.net:1935/live/bb5d4f3d9e164c0f9be19453633606cc"
                //  }
            ] 
        },
        preview : {
            endpoints : [
                // {
                //     protocol : "RTMP",
                //     url : uniqueness2
                // }           
            ] 
        }
    })
    .then(res=> console.log("res ",res))
    .catch(err => console.log("err ",err)) 
    
}
const uuid = ()=> uuidv4()

module.exports = router;

