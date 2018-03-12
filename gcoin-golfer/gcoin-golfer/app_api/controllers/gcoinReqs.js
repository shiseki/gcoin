/* Gcoin request API for Golfers to buy and sell gcoins */

/* Read Gcoin Requests to make a list of my gcoin buy and sell requests */ 
module.exports.gcoinReqsList = function(req, res) {          // gcoinReqs?requester_id=<requester_id> 
  res.status(200);
  res.json({"status" : "success"});
};

/* Create a Gcoin Request to make a request for buying or selling gcoin */ 
module.exports.gcoinReqsCreate = function(req, res) {
  const NS = 'org.acme.gcoin';
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const bizNetworkConnection = new BusinessNetworkConnection();

  let config = require('config').get('gcoin-golfer');
  const CONNECTION_PROFILE_NAME = config.get('connectionProfile');
  const businessNetworkIdentifier = config.get('businessNetworkIdentifier');
  const participantId = req.body.enrollmentId;
  const participantPwd = req.body.enrollmentSecret;

  let bizNetworkDefinition = null;
  return bizNetworkConnection.connect(CONNECTION_PROFILE_NAME, businessNetworkIdentifier, participantId, participantPwd)
  .then((result)=>{
    console.log("connected to gcoin-network");
    bizNetworkDefinition = result;
    const factory = bizNetworkDefinition.getFactory();

/* Submit "create gcoin request" transaction */
    let createGcoinRequest = factory.newTransaction(NS, 'CreateGcoinRequest');
    let uiqueStr = new Date().getTime().toString(16);
    createGcoinRequest.gcoinRequestId = 'gcoinReq' + uniqueStr;
    createGcoinRequest.requester = factory.newRelationship(NS, 'Golfer', req.body.requester);
    createGcoinRequest.bank = factory.newRelationship(NS, 'Bank', req.body.bank);
    createGcoinRequest.requestType = req.body.requestType;
    createGcoinRequest.amount = parseInt(req.body.amount);
    return bizNetworkConnection.submitTransaction(createGcoinRequest);
  })
  .then(()=> {
    console.log("CreateGcoinRequest transaction submitted");
    return bizNetworkConnection.disconnect()
  })
  .then(()=> {
    console.log("disconnected from gcoin-network")
    res.status(201);
    res.json(createGcoinRequest);
  })
  .catch(function(error){
    throw error;
  });
}


