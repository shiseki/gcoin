/* Gcoin request API for Golfers to buy and sell gcoins */
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const NS = 'org.acme.gcoin';
let serializer;
let createGcoinRequestJSON;

/* Read Gcoin Requests to make a list of my gcoin buy and sell requests */
module.exports.gcoinReqsList = function(req, res) {          // gcoinReqs?userName=<userName>
/* Connect to business network */
  const config = require('config').get(req.query.userName);
  const cardName = config.get('cardName');
  const businessNetworkIdentifier = config.get('businessNetworkIdentifier');
  
  let bizNetworkDefinition = null;
  let gcoinReqs = [];
  return bizNetworkConnection.connect(cardName)
  .then((result)=>{
    console.log("connected to gcoin-network in gcoinReqsList");
    bizNetworkDefinition = result;
    serializer = bizNetworkDefinition.getSerializer();
    return bizNetworkConnection.getAssetRegistry('org.acme.gcoin.GcoinRequest')
  })
  .then((registry)=> {
    return registry.getAll()
  })
  .then((aResources) => {
    let arrayLength = aResources.length;
    let resourceJSON;
    for (let i = 0; i < arrayLength; i++) {
      resourceJSON = serializer.toJSON(aResources[i]);
      console.log("gcoinRequestId: " + resourceJSON.gcoinRequestId);
      console.log("requester: " + resourceJSON.requester);
      console.log("bank: " + resourceJSON.bank);
      console.log("requestType: " + resourceJSON.requestType);
      console.log("amount: " + resourceJSON.amount);
      console.log("requestDate: " + resourceJSON.requestDate);
      console.log("processDate: " + resourceJSON.processDate);
      if (resourceJSON.processDate == "1970-01-01T00:00:00.000Z") {
        resourceJSON.processDate = "";
      }
      gcoinReqs.push(resourceJSON);
    }
    return bizNetworkConnection.disconnect()
  })
  .then(()=> {
    console.log("disconnected from gcoin-network")
    res.status(200);
    res.json(gcoinReqs);
  })
  .catch(function(error){
    throw error;
  });
};

/* Create a Gcoin Request to make a request for buying or selling gcoin */ 
module.exports.gcoinReqsCreate = function(req, res) {
  /* Connect to business network */
  const config = require('config').get(req.query.userName);
  const cardName = config.get('cardName');
  const businessNetworkIdentifier = config.get('businessNetworkIdentifier');

  let bizNetworkDefinition = null;
  return bizNetworkConnection.connect(cardName)
  .then((result)=>{
    console.log("connected to gcoin-network in gcoinReqsCreate");
    bizNetworkDefinition = result;
    serializer = bizNetworkDefinition.getSerializer();
    const factory = bizNetworkDefinition.getFactory();

/* Submit "create gcoin request" transaction */
    let createGcoinRequest = factory.newTransaction(NS, 'CreateGcoinRequest');
    let uniqueStr = new Date().getTime().toString(16);
    createGcoinRequest.gcoinRequestId = 'gcoinReq' + uniqueStr;
    createGcoinRequest.requester = factory.newRelationship(NS, 'Golfer', req.body.requester);
    createGcoinRequest.bank = factory.newRelationship(NS, 'Bank', req.body.bank);
//    createGcoinRequest.requester = req.body.requester;
//    createGcoinRequest.bank = req.body.bank;
    createGcoinRequest.requestType = req.body.requestType;
    createGcoinRequest.amount = parseInt(req.body.amount);
    createGcoinRequestJSON = serializer.toJSON(createGcoinRequest);
    console.log("CreateGcoinRequest transaction is being submitted");
    console.log("createGcoinRequest.requester: " + createGcoinRequest.requester);
    console.log("createGcoinRequest.bank: " + createGcoinRequest.bank);
    return bizNetworkConnection.submitTransaction(createGcoinRequest);
  })
  .then(()=> {
    console.log("CreateGcoinRequest transaction submitted");
    return bizNetworkConnection.disconnect()
  })
  .then(()=> {
    console.log("disconnected from gcoin-network")
    res.status(201);
    res.json(createGcoinRequestJSON);
  })
  .catch(function(error){
    throw error;
  });
}
