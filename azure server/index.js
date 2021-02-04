//  https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/transforms/:transformName?api-version={{api-version}}


const os = require("os");
const async = require('async');
const util = require('util');
const uuidv4 = require('uuid/v4');
const path = require('path');
const url = require('url');
const fs = require('fs');
const fetch = require('node-fetch');


const MediaServices = require('azure-arm-mediaservices');
// import { AzureMediaServices, AzureMediaServicesModels, AzureMediaServicesMappers } from "@azure/arm-mediaservices";
// const MediaServices = AzureMediaServices
const msRestAzure = require('ms-rest-azure');
const msRest = require('ms-rest');
const azureStorage = require('azure-storage');

const setTimeoutPromise = util.promisify(setTimeout);

// endpoint config
// make sure your URL values end with '/'

const armAadAudience = "https://management.core.windows.net/";
const AadTenantDomain = "anasm9877gmail.onmicrosoft.com"
const aadEndpoint = "https://login.microsoftonline.com/"; 
// const aadEndpoint = "https://login.microsoftonline.com/f4d674fc-3ec6-4a06-af9c-0285598e415a/oauth2/v2.0/authorize/"; 
const armEndpoint = "https://management.azure.com/";
const subscriptionId = "5f3f711c-c648-4839-8dd8-9315e520d85f";
const accountName ="abc";
const location ="East US";
// const aadSecret ="jd.QVvP1H0-8mmxwuL8qWr6b9V7U7Z1._J";

// const aadSecret ="toX52tuT_.LCsueBoDjH953YK9_RAeG~19";
const aadClientId = "3e1769df-a14c-4f58-b4b1-c48c69a1dc60";
const aadSecret ="-tv9_8m_Q50-i-8XiIaCyO0a125f44bkWr";
const aadTenantId ="f4d674fc-3ec6-4a06-af9c-0285598e415a";

const resourceGroup ="abc";
const outputFolder = "Temp";

// vaultUri = "https://live-key.vault.azure.net/"



// You can either specify a local input file with the inputFile or an input Url with inputUrl.  Set the other one to null.
// const inputUrl = null;
// const inputFile = "c:\\temp\\input.mp4";
const inputFile = null;
const inputUrl = "https://amssamples.streaming.mediaservices.windows.net/2e91931e-0d29-482b-a42b-9aadc93eb825/AzurePromo.mp4";

const encodingTransformName = "TransformWithAdaptiveStreamingPreset";

// constants
const timeoutSeconds = 60 * 10;
const sleepInterval = 1000 * 15;

let azureMediaServicesClient;
let inputExtension;
let blobName = null;

///////////////////////////////////////////
//     Entrypoint for sample script      //
///////////////////////////////////////////

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
    console.log("connected");

  parseArguments();
    try {

    // const list = await lists(resourceGroup, accountName)
    // console.log("lists ",list,list.length)
    // Ensure that you have the desired encoding Transform. This is really a one time setup operation.
    // console.log("creating encoding transform...");
    // let adaptiveStreamingTransform = {
    //     odatatype: "#Microsoft.Media.BuiltInStandardEncoderPreset",
    //     presetName: "AdaptiveStreaming"
    // }; 
    // let encodingTransform = await ensureTransformExists(resourceGroup, accountName, encodingTransformName, adaptiveStreamingTransform);
    // console.log("getting job input from arguments...");
    const namePrefix = "pledge"
    let uniqueness = uuidv4();
    // let input = await getJobInputFromArguments(uniqueness);
    // let outputAssetName = namePrefix + '-output-' + uniqueness;
    let outputLiveStreamName = namePrefix + '-output-' + uniqueness;
    outputLiveStreamName = outputLiveStreamName.slice(0,32)
    // let jobName = namePrefix + '-job-' + uniqueness;
    // let locatorName = "locator" + uniqueness;
    console.log(uniqueness)
    console.log("creating live stream...")
    let liveEventCreate = await liveEventCreator(resourceGroup, accountName, outputLiveStreamName, uniqueness)
    // console.log("event",liveEventCreate)

    console.log("live event start")
    let liveEventStart = await liveEventStarter(resourceGroup, accountName, outputLiveStreamName)
    console.log(liveEventStart)
    // console.log("creating output asset...");
    // let outputAsset = await createOutputAsset(resourceGroup, accountName, outputAssetName);

    // console.log("submitting job...");
    // let job = await submitJob(resourceGroup, accountName, encodingTransformName, jobName, input, outputAsset.name);

    // console.log("waiting for job to finish...");
    // job = await waitForJobToFinish(resourceGroup, accountName, encodingTransformName, jobName);

    // if (job.state == "Finished") {
    //   await downloadResults(resourceGroup, accountName, outputAsset.name, outputFolder);

    //   let locator = await createStreamingLocator(resourceGroup, accountName, outputAsset.name, locatorName);

    //   let urls = await getStreamingUrls(resourceGroup, accountName, locator.name);
    //   // console.log("streaming URLs \n",urls)
    //   console.log("deleting jobs ...");
    //   await azureMediaServicesClient.jobs.deleteMethod(resourceGroup, accountName, encodingTransformName, jobName);
    //  // await azureMediaServicesClient.assets.deleteMethod(resourceGroup, accountName, outputAsset.name);

    //   let jobInputAsset = input;
    //   if (jobInputAsset && jobInputAsset.assetName) {
    //     await azureMediaServicesClient.assets.deleteMethod(resourceGroup, accountName, jobInputAsset.assetName);
    //   }
    // } else if (job.state == "Error") {
    //   console.log(`${job.name} failed. Error details:`);
    //   console.log(job.outputs[0].error);
    // } else if (job.state == "Canceled") {
    //   console.log(`${job.name} was unexpectedly canceled.`);
    // } else {
    //   console.log(`${job.name} is still in progress.  Current state is ${job.state}.`);
    // }
    // console.log("done with sample");
  } catch (err) {
    console.log("=>",err);
  }
});
async function liveEventStarter(resourceGroup, accountName, liveEventName){
  return await azureMediaServicesClient.liveEvents.start(resourceGroup, accountName, liveEventName)
}
async function liveEventCreator(resourceGroup, accountName, liveEventName, uuid){

  return  await azureMediaServicesClient.liveEvents.create(resourceGroup, accountName, liveEventName,{
    location ,
      input : {
        accessControl : "ip",
        accessToken : uuid, 
        // keyFrameIntervalDuration : "PT2S",
        streamingProtocol : "RTMP",
        // endpoints : "url" 
      }
  })
  .then(res=> console.log("res ",res))
  .catch(err => console.log("err ",err)) 
}
async function lists(resourceGroup, accountName){
  return await azureMediaServicesClient.assets.list(resourceGroup, accountName)
}

async function downloadResults(resourceGroup, accountName, assetName, resultsFolder) {
  let date = new Date();
  date.setHours(date.getHours() + 1);
  let input = {
    permissions: "Read",
    expiryTime: date
  }
  let assetContainerSas = await azureMediaServicesClient.assets.listContainerSas(resourceGroup, accountName, assetName, input);
  // console.log("assets \n",assetContainerSas)
  let containerSasUrl = assetContainerSas.assetContainerSasUrls[0] || null;
  let sasUri = url.parse(containerSasUrl);
  let sharedBlobService = azureStorage.createBlobServiceWithSas(sasUri.host, sasUri.search);
  let containerName = sasUri.pathname.replace(/^\/+/g, '');
  let directory = path.join(resultsFolder, assetName);
  try {
    fs.mkdirSync(directory);
  } catch (err) {
    // directory exists
  }
  console.log(`gathering blobs in container ${containerName}...`);
  function createBlobListPromise() {
    return new Promise(function (resolve, reject) {
      return sharedBlobService.listBlobsSegmented(containerName, null, (err, result, response) => {
        if (err) { reject(err); }
        resolve(result);
      });
    });
  }
  let blobs = await createBlobListPromise();
  console.log("downloading blobs to local directory in background...");
  for (let i = 0; i < blobs.entries.length; i++){
    let blob = blobs.entries[i];
    if (blob.blobType == "BlockBlob"){
      sharedBlobService.getBlobToLocalFile(containerName, blob.name, path.join(directory, blob.name), (error, result) => {
        if (error) console.log(error);
      });
    }
  }
}

async function waitForJobToFinish(resourceGroup, accountName, transformName, jobName) {
  let timeout = new Date();
  timeout.setSeconds(timeout.getSeconds() + timeoutSeconds);

  async function pollForJobStatus() {
    let job = await azureMediaServicesClient.jobs.get(resourceGroup, accountName, transformName, jobName);
    console.log(job.state);
    if (job.state == 'Finished' || job.state == 'Error' || job.state == 'Canceled') {
      return job;
    } else if (new Date() > timeout) {
      console.log(`Job ${job.name} timed out.`);
      return job;
    } else {
      await setTimeoutPromise(sleepInterval, null);
      return pollForJobStatus();
    }
  }

  return await pollForJobStatus();
}

async function submitJob(resourceGroup, accountName, transformName, jobName, jobInput, outputAssetName) {
  let jobOutputs = [
    {
      odatatype: "#Microsoft.Media.JobOutputAsset",
      assetName: outputAssetName
    }
  ];

  return await azureMediaServicesClient.jobs.create(resourceGroup, accountName, transformName, jobName, {
    input: jobInput,
    outputs: jobOutputs
  });
}


async function getJobInputFromArguments(resourceGroup, accountName, uniqueness) {
  if (inputFile) {
    let assetName = namePrefix + "-input-" + uniqueness;
    await createInputAsset(resourceGroup, accountName, assetName, inputFile);
    return {
      odatatype: "#Microsoft.Media.JobInputAsset",
      assetName: assetName
    }
  } else {
    return {
      odatatype: "#Microsoft.Media.JobInputHttp",
      files: [inputUrl]
    }
  }
}

async function createOutputAsset(resourceGroup, accountName, assetName) {
    return await azureMediaServicesClient.assets.createOrUpdate(resourceGroup, accountName, assetName, {});

}

async function createInputAsset(resourceGroup, accountName, assetName, fileToUpload) {
  let asset = await azureMediaServicesClient.assets.createOrUpdate(resourceGroup, accountName, assetName, {});
  let date = new Date();
  date.setHours(date.getHours() + 1);
  let input = {
    permissions: "ReadWrite",
    expiryTime: date
  }
  let response = await azureMediaServicesClient.assets.listContainerSas(resourceGroup, accountName, assetName, input);
  let uploadSasUrl = response.assetContainerSasUrls[0] || null;
  let fileName = path.basename(fileToUpload);
  let sasUri = url.parse(uploadSasUrl);
  let sharedBlobService = azureStorage.createBlobServiceWithSas(sasUri.host, sasUri.search);
  let containerName = sasUri.pathname.replace(/^\/+/g, '');
  let randomInt = Math.round(Math.random() * 100);
  blobName = fileName + randomInt;
  console.log("uploading to blob...");
  function createBlobPromise() {
    return new Promise(function (resolve, reject) {
      sharedBlobService.createBlockBlobFromLocalFile(containerName, blobName, fileToUpload, resolve);
    });
  }
  await createBlobPromise();
  return asset;
}

async function ensureTransformExists(resourceGroup, accountName, transformName, preset) {
  let transform = await azureMediaServicesClient.transforms.get(resourceGroup, accountName, transformName);

  if (!transform) {
      transform = await azureMediaServicesClient.transforms.createOrUpdate(resourceGroup, accountName, transformName, {
      name: transformName,
      location: location,
      outputs: [{
        preset: preset
      }]
    });
  }
  return transform;
}

async function createStreamingLocator(resourceGroup, accountName, assetName, locatorName)
{
  let streamingLocator = {
    assetName: assetName,
    streamingPolicyName: "Predefined_ClearStreamingOnly"
  };

  let locator = await azureMediaServicesClient.streamingLocators.create(
      resourceGroup,
      accountName,
      locatorName,
      streamingLocator);

  return locator;
}

async function getStreamingUrls(resourceGroup, accountName, locatorName)
{
  // Make sure the streaming endpoint is in the "Running" state.

  let streamingEndpoint = await azureMediaServicesClient.streamingEndpoints.get(resourceGroup, accountName, "default");
  console.log("endpoint = ",streamingEndpoint)
  let paths = await azureMediaServicesClient.streamingLocators.listPaths(resourceGroup, accountName, locatorName);

   for (let i = 0; i < paths.streamingPaths.length; i++){
      let path = paths.streamingPaths[i].paths[0];
      console.log("https://"+ streamingEndpoint.hostName + "//" + path);
    }
}

function parseArguments() {
  if (inputFile) {
    inputExtension = path.extname(inputFile);
  } else {
    inputExtension = path.extname(inputUrl);
  }
}
