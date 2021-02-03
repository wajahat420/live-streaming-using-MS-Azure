const express = require('express');
const msRestAzure = require('ms-rest-azure');
const KeyVault = require('azure-keyvault');
const KEY_VAULT_URL = "https://live-key.vault.azure.net/"
const SECRET_NAME = "live-key"
const SECRET_VERSION = null || process.env['SECRET_VERSION'];

let app = express();
let clientId = "3e1769df-a14c-4f58-b4b1-c48c69a1dc60"
let tenantId = "f4d674fc-3ec6-4a06-af9c-0285598e415a";
let clientSecret = "jd.QVvP1H0-8mmxwuL8qWr6b9V7U7Z1._J";
// let clientSecret = "jd.QVvP1H0-8mmxwuL8qWr6b9V7U7Z7374";
// let tenantId = "f4d674fc-3ec6-4a06-af9c-0285jsjsjsj";

getKeyVaultCredentials = async()=>{
  const a = await new msRestAzure.ApplicationTokenCredentials(clientId, tenantId, clientSecret);
//   console.log("a=",a)
  return a
}

function getKeyVaultSecret(credentials) {
    console.log("credentials",credentials)
  let keyVaultClient = new KeyVault.KeyVaultClient(credentials);
  return keyVaultClient.getSecret(KEY_VAULT_URL, SECRET_NAME, SECRET_VERSION);
}

// getKeyVaultCredentials()
// .then(
//     getKeyVaultSecret
//   ).then(function (secret){

//       console.log(`Your secret value is: ${secret}.`)
//     // res.send(`Your secret value is: ${secret.value}.`);
//   }).catch(function (err) {
//         console.log("error : ",err)
//     // res.send(err);
// });

app.get('/', function (req, res) {
  getKeyVaultCredentials().then(
    getKeyVaultSecret
  ).then(function (secret){
    res.send(`Your secret value is: ${secret.value}.`);
  }).catch(function (err) {
    res.send(err);
  });
});

let port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`);
})