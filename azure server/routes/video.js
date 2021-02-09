
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
// const AadTenantDomain = "anasm9877gmail.onmicrosoft.com"
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
const moment = require("moment");


let azureMediaServicesClient;
let liveEventName = "new"

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
    liveEventName = namePrefix + '-' + uniqueness;
    liveEventName = liveEventName.slice(0,32)
    liveOutputName = "output-123456-123"
    assetName = "aseet-"+liveEventName.slice(15)


    // console.log("creating live stream...",uniqueness)
    // await liveEventCreator(resourceGroup, accountName, liveEventName, uniqueness)

    liveEventName = "new"

    console.log("live event start.")
    let liveEventStart = await liveEventStarter(resourceGroup, accountName, liveEventName)
    console.log("liveEventStart",liveEventStart)
    res.send(liveEventStart)

    console.log("creating output asset")  
    await createOutputAsset(resourceGroup, accountName, assetName)

    console.log("creating live output")
    await createLiveOutput(resourceGroup, accountName, liveEventName, liveOutputName, assetName)

    // console.log("creating stream locator")
    // await createStreamLocator(resourceGroup, accountName, liveEventName,assetName)


    // console.log("get stream locator")
    // await getStreamLocator(resourceGroup, accountName, liveEventName)

    // console.log("get live output")
    // await getLiveOutput(resourceGroup, accountName, liveEventName, liveOutputName)

    // console.log("starting endpoint")
    // const endpoint = await startingEndpoint(resourceGroup, accountName)
    // console.log("endpoint",endpoint)

    // console.log("getting endpoints",uniqueness)
    // getStreamingEndpoint(resourceGroup, accountName, uniqueness)
})
router.use("/livePaths",async function(req,res){
    console.log("list paths")
    const start = "https://abc-usea.streaming.media.azure.net"
    await azureMediaServicesClient.streamingLocators.listPaths(resourceGroup, accountName, liveEventName)
    .then(response=> {
        res.send(start + response.streamingPaths[0].paths[0]) 
        console.log(response.streamingPaths,"\n\n")
        console.log("res ",response.streamingPaths[0].paths)
    })
    .catch(err => console.log("err ",err)) 
    
})

// FUNCTIONS

async function liveEventStarter(resourceGroup, accountName, liveEventName){
    let liveStreamInput = ""

    await azureMediaServicesClient.liveEvents.start(resourceGroup, accountName,liveEventName)

    console.log("getting live event")
    await getLiveEvent(resourceGroup, accountName, liveEventName)
    .then(res=> { 
        console.log("res ",res,"\n input endpoints = ",res.input.endpoints[0].url)
        liveStreamInput = res.input.endpoints[0].url
    })
    .catch(err => console.log("err ",err)) 

    return liveStreamInput
}
async function liveEventCreator(resourceGroup, accountName, liveEventName, uuidd){

    return  await azureMediaServicesClient.liveEvents.create(resourceGroup, accountName, liveEventName,{
        location ,
        input : {
            accessControl : "ip",
            accessToken : uuidd, 
            // keyFrameIntervalDuration : "PT2S",
            streamingProtocol : "RTMP",
        }
    })
    .then(res=> console.log("res ",res))
    .catch(err => console.log("err ",err)) 
    
}

const uuid = ()=> uuidv4()

async function getStreamLocator(resourceGroupName, accountName, liveEventName){ 
    return await azureMediaServicesClient.streamingLocators.get(resourceGroupName, accountName, liveEventName)
    .then(res=> console.log("res ",res))
    .catch(err => console.log("err ",err)) 
}

async function createStreamLocator(resourceGroupName, accountName, liveEventName,assetName){ 
    return await azureMediaServicesClient.streamingLocators.create(resourceGroupName, accountName, liveEventName,{
        assetName,
        streamingPolicyName : "Predefined_ClearStreamingOnly"
    } )
    .then(res=> console.log("res ",res))
    .catch(err => console.log("err ",err))  
}

async function createLiveOutput(resourceGroup, accountName, streamingLocatorName, liveOutputName, assetName){
    return await azureMediaServicesClient.liveOutputs.create(resourceGroup, accountName, streamingLocatorName, liveOutputName, {
            archiveWindowLength : moment.duration("PT3M"),
            assetName,
            hls : {
                fragmentsPerTsSegment : 5
            }
    })
    .then(res=> console.log("res ",res))
    .catch(err => console.log("err ",err)) 
}

async function getLiveOutput(resourceGroup, accountName, liveEventName, liveOutputName){
    // console.log("assetname",liveEventName)
    return await azureMediaServicesClient.liveOutputs.get(resourceGroup, accountName, liveEventName, liveOutputName)
    .then(res=> console.log("res ",res)) 
    .catch(err => console.log("err ",err)) 
}
    
async function createOutputAsset(resourceGroup, accountName, assetName) {
    return await azureMediaServicesClient.assets.createOrUpdate(resourceGroup, accountName, assetName, {});
}

async function getLiveEvent(resourceGroup, accountName, liveEventName){
    return await azureMediaServicesClient.liveEvents.get(resourceGroup, accountName, liveEventName)
}

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

module.exports = router;

