var someAzureServiceClient = require('azure-arm-someService');
const msRestAzure = require('ms-rest-azure');

const username = "Muhammad Anas Masood"
const password = "B7462a19"
msRestAzure.loginWithUsernamePassword(username, password, function(err, credentials) {
  if (err) return console.log(err);
  var client = new someAzureServiceClient(credentials, 'your-subscriptionId');
  client.someOperationGroup.method(param1, param2, function(err, result) {
    if (err) return console.log(err);
    return console.log(result);
  });
});