const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();

let config = require('config').get('gcoin-golfer');
const CONNECTION_PROFILE_NAME = config.get('connectionProfile');
const businessNetworkIdentifier = config.get('businessNetworkIdentifier');
const participantId = config.get('participantId');
const participantPwd = config.get('participantPwd');

let bizNetworkDefinition = null;
return bizNetworkConnection.connect(CONNECTION_PROFILE_NAME, businessNetworkIdentifier, participantId, participantPwd)
.then((result)=>{
  console.log("connected to gcoin-network");
  bizNetworkDefinition = result;
  const factory = bizNetworkDefinition.getFactory();
  return bizNetworkConnection.ping()
})
.then(()=> {
  console.log("ping success");
  return bizNetworkConnection.disconnect()
})
.then(()=> {
  console.log("disconnected from gcoin-network")
})
.catch(function(error){
  throw error;
});
