const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();

let config = require('config').get('admin');
const cardName = config.get('cardName');
const businessNetworkIdentifier = config.get('businessNetworkIdentifier');

let bizNetworkDefinition = null;
return bizNetworkConnection.connect(cardName)
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
