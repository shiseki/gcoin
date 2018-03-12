/* Gcoin Request APIs for banks to list and process gcoin requests */

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const NS = 'org.acme.gcoin';
let serializer;
let processGcoinRequestJSON;

/* Read Gcoin Requests to make a list of gcoin requests to my bank */
module.exports.gcoinReqsList = function(req, res) {          // gcoinReqs?userName=<userName>

/* Connect to business network */
  const config = require('config').get(req.query.userName);
  const cardName = config.get('cardName');
  const businessNetworkIdentifier = config.get('businessNetworkIdentifier');

  let bizNetworkDefinition = null;
  let gcoinReqs = [];
  return bizNetworkConnection.connect(cardName)
  .then((result)=>{
    console.log("connected to gcoin-network in gcoinRequestList");
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

/* Read a Gcoin Request by gcoin request id */
module.exports.gcoinReqsReadOne = function(req, res) {
  if (!req.params || !req.params.gcoinRequestId) {
    res.status(404);
    res.json({"message": "No gcoinRequestId in request"});
  } else {

/* Connect to business network */
    const config = require('config').get(req.query.userName);
    const cardName = config.get('cardName');
    const businessNetworkIdentifier = config.get('businessNetworkIdentifier');

    let bizNetworkDefinition = null;
    let gcoinReq, gcoinReqJSON;
    return bizNetworkConnection.connect(cardName)
    .then((result)=>{
      console.log("connected to gcoin-network in gcoinReqsReadOne");
      bizNetworkDefinition = result;
      serializer = bizNetworkDefinition.getSerializer();
      return bizNetworkConnection.getAssetRegistry('org.acme.gcoin.GcoinRequest')
    })
    .then((registry)=> {
      return registry.get(req.params.gcoinRequestId)
    })
    .then((gcoinReq) => {
      gcoinReqJSON = serializer.toJSON(gcoinReq);
      console.log("gcoinRequestId: " + gcoinReqJSON.gcoinRequestId);
      console.log("requester: " + gcoinReqJSON.requester);
      console.log("bank: " + gcoinReqJSON.bank);
      console.log("requestType: " + gcoinReqJSON.requestType);
      console.log("amount: " + gcoinReqJSON.amount);
      console.log("requestDate: " + gcoinReqJSON.requestDate);
      console.log("processDate: " + gcoinReqJSON.processDate);
      if (gcoinReqJSON.processDate == "1970-01-01T00:00:00.000Z") {
        gcoinReqJSON.processDate = "";
      }
      return bizNetworkConnection.disconnect()
    })
    .then(()=> {
      console.log("disconnected from gcoin-network")
      res.status(200);
      res.json(gcoinReqJSON);
    })
    .catch(function(error){
      throw error;
    });
  }
 };

/* Update a Gcoin Request by gcoin request id to process a gcoin request */
module.exports.gcoinReqsUpdateOne = function(req, res) {
  if (!req.params || !req.params.gcoinRequestId) {
    res.status(404);
    res.json({"message": "No gcoinRequestId in request"});
  } else {
    
/* Connect to business network */
    const config = require('config').get(req.query.userName);
    const cardName = config.get('cardName');
    const businessNetworkIdentifier = config.get('businessNetworkIdentifier');

    let bizNetworkDefinition = null;
    return bizNetworkConnection.connect(cardName)
    .then((result)=>{
      console.log("connected to gcoin-network in gcoinReqsUpdateOne");
      bizNetworkDefinition = result;
      serializer = bizNetworkDefinition.getSerializer();
      const factory = bizNetworkDefinition.getFactory();

/* Submit "process gcoin request" transaction */
      let processGcoinRequest = factory.newTransaction(NS, 'ProcessGcoinRequest');
      processGcoinRequest.gcoinRequestId = req.params.gcoinRequestId;
      processGcoinRequestJSON = serializer.toJSON(processGcoinRequest);
      return bizNetworkConnection.submitTransaction(processGcoinRequest);
    })
    .then(()=> {
      console.log("ProcessGcoinRequest transaction submitted");
      return bizNetworkConnection.disconnect()
    })
    .then(()=> {
      console.log("disconnected from gcoin-network")
      res.status(201);
      res.json(processGcoinRequestJSON);
    })
    .catch(function(error){
      throw error;
    });
  }
};
