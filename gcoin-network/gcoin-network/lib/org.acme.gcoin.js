/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * G-coin transction processor functions
 */

/**
 * A transaction processor for CreateGcoinRequest
 * @param {org.acme.gcoin.CreateGcoinRequest} tx - the transaction instance to creat a Gcoin request
 * @transaction
 */
function onCreateGcoinRequest(tx) {
  console.log('onCreateGcoinRequest');

  var factory = getFactory();

  var requesterWallet;
  var bankWallet;
  var gcoinRequest;

  // verify that the CreateGcoinRequest transaction was submitted by the requester specified in the request 
//   var currentParticipantId = getCurrentParticipant();
//   if (currentParticipantId !== gcoinRequest.requester.$identifier) {
//     throw new Error('CreateGcoinRequest transaction was submitted not by the requester specified in the request');
//   }

  // house keeping routine to access registries 
  var walletRegistry;
  var gcoinRequestRegistry;
  return getAssetRegistry('org.acme.gcoin.Wallet')
    .then(function(assetRegistry) {
      walletRegistry = assetRegistry;
      return getAssetRegistry('org.acme.gcoin.GcoinRequest');
    })
    .then(function(assetRegistry) {
      gcoinRequestRegistry = assetRegistry;
  // end of house keeping routine

  // verify that the specified Gcoin request does not exit in the GcoinRequest registy
 //     if (gcoinRequestRegistry.exists(tx.gcoinRequest.gcoinRequestId)) {
 //       throw new Error('Gcoin request ' + tx.gcoinRequest.gcoinRequestId + ' to create already exists in the registry');
 //     }

  // on SELL request, move Gcoin from the requester's wallet to the bank's wallet 
      if (tx.requestType == 'SELL') {
        requesterWallet = tx.requester.wallet;
        bankWallet = tx.bank.wallet;
        if (requesterWallet.gcoinBalance < tx.amount) {
          throw new Error("Gcoin balance of the requester's wallet is less than the amount requested to sell");
        } else {
          requesterWallet.gcoinBalance -= tx.amount;
          bankWallet.gcoinBalance += tx.amount;
          return walletRegistry.updateAll([requesterWallet, bankWallet]);
        }
      }
    })

  // set gcoinRequest to tx.gcoinRequest and the transaction's system timestamp
    .then(function() {
      gcoinRequest = factory.newResource('org.acme.gcoin', 'GcoinRequest', tx.gcoinRequestId);
      gcoinRequest.requester = tx.requester;
      gcoinRequest.bank = tx.bank;
      gcoinRequest.requestType = tx.requestType;
      gcoinRequest.amount = tx.amount;
      gcoinRequest.requestDate = tx.timestamp;
      gcoinRequest.processDate = new Date(0);
  
  // persist GcoinRequest 
      return gcoinRequestRegistry.add(gcoinRequest);
    })

  // emit a notification that GcoinRequest has been created
    .then(function() {
      var createdGcoinRequestEvent = factory.newEvent('org.acme.gcoin', 'CreatedGcoinRequestEvent');
      createdGcoinRequestEvent.gcoinRequest = gcoinRequest;
      emit(createdGcoinRequestEvent);
    })
    .catch(function(error) {
      throw error;
    });
}

/**
 * A transaction processor for ProcessGcoinRequest
 * @param {org.acme.gcoin.ProcessGcoinRequest} tx - the transaction instance to process the Gcoin request 
 * @transaction
 */  
function onProcessGcoinRequest(tx) {
  console.log('onProcessGcoinRequest');
  var requesterWallet;
  var bankWallet;
  var gcoinRequest;

  // verify that the ProcessGcoinRequest transaction was submitted by the bank specifed in the request
//  var currentParticipantId = getCurrentParticipant();
//  if (currentParticipantId !== gcoinRequest.bank.$identifier) {
//    throw new Error('ProcessGcoinRequest transaction was submitted not by the bank specified in the request');
//  }

  // house keeping routine to access registries 
  var walletRegistry;
  var gcoinRequestRegistry;

  return getAssetRegistry('org.acme.gcoin.Wallet')
    .then(function(assetRegistry) {
      walletRegistry = assetRegistry;
      return getAssetRegistry('org.acme.gcoin.GcoinRequest')
    })
    .then(function(assetRegistry) {
      gcoinRequestRegistry = assetRegistry;
  // end of house keeping routine

  // on BUY request, move Gcoin from the bank's wallet to the requester's wallet
      if (tx.gcoinRequest.requestType == 'BUY') { 
        requesterWallet = tx.gcoinRequest.requester.wallet;
        bankWallet = tx.gcoinRequest.bank.wallet;
        requesterWallet.gcoinBalance += tx.gcoinRequest.amount;
        bankWallet.gcoinBalance -= tx.gcoinRequest.amount;
        return walletRegistry.updateAll([requesterWallet, bankWallet]);
      }
    })
    .then(function() {
  // set gcoinRequest.processDate to transaction's system timestamp
      gcoinRequest = tx.gcoinRequest;
      gcoinRequest.processDate = tx.timestamp;

  // persist update of GcoinRequest
      return gcoinRequestRegistry.update(gcoinRequest);
    })
    .then(function() {
  // emit a notification that GcoinRequest has been completed
      var completedGcoinRequestEvent = getFactory().newEvent('org.acme.gcoin', 'CompletedGcoinRequestEvent');
      completedGcoinRequestEvent.gcoinRequest = gcoinRequest;
      emit(completedGcoinRequestEvent);
    })
    .catch(function(error) {
      throw error;
    });
}

/**
 * A transaction processor for CreateMembershipOrder
 * @param {org.acme.gcoin.CreateMembershipOrder} tx - the transaction instance to creat an order for selling membership
 * @transaction
 */
function onCreateMembershipOrder(tx) {
  console.log('onCreateMembershipOrder');
  var sellMembershipOrder = tx.sellMembershipOrder;

  // verify that the CreateMembershipOrder transaction was submitted by the seller specified in the order
  var currentParticipantId = getCurrentParticipant();
  if (currentParticipantId !== sellMembershipOrder.seller.$identifier) {
    throw new Error('Membership selling order was made not by the seller specified in the order');
  }

  return getAssetRegistry('org.acme.gcoin.SellMembershipOrder')
    .then(function(sellMembershipOrderRegistry) {
  // verify that the specified order does not exist in the SellMembershipOrder registry
      if (sellMembershipOrderRegistry.exists(sellMembershipOrder.$identifier)) {
        throw new Error('membership selling order to create already exists in the registry');
      }

  // set sellMembershipOrder.sellDate to transaction's system timestamp
      sellMembershipOrder.sellDate = tx.timestamp;

  // persist SellMembershipOrder 
      return sellMembershipOrderRegistry.add(sellMembershipOrder);    
    }); 
}

/**
 * A transaction processor for BuyMembershipOrder
 * @param {org.acme.gcoin.BuyMembershipOrder} tx - the transaction instance to update an selling order for buying membership
 * @transaction
 */
function onBuyMembershipOrder(tx) {
  console.log('onBuyMembershipOrder');
  var sellMembersipOrder;
  var sellerWallet;
  var buyerWallet;
  var courseWallet;

  // verify that the BuyMembershipOrder transaction was submitted by the buyer specified in the order
  var currentParticipantId = getCurrentParticipant();
  if (currentParticipanId !== sellMembershipOrder.buyer.$idenfifier) {
    throw new Error('Membership buying order was not made by the buyer written in the order');
  }

  return getAssetRegistry('org.acme.gcoin.SellMembershipOrder')
    .then(function(sellMembershipOrderRegistry) {
  // verify that the specified order exists in the SellMembershipOrder registry
      if (!sellMembershipOrderRegistry.exists(tx.sellMembershipOrder.$identifier)) {
        throw new Error('membership selling order to update does not exist in the registry');
      }
      return sellMembershipOrderRegistry.get(tx.sellMembersipOrder.$idenfifier)
        .then(function(retrievedOrder) {
          sellMembershipOrder = retrievedOrder;
          sellrWallet = sellMembershipOrder.seller.wallet;
          buyerWallet = sellMembershipOrder.buyer.wallet;
          courseWallet = sellMembershipOrder.membership.golfCourse.wallet;

  // set sellMembershipOrder.buyDate to transaction's system timestamp
          sellMembershipOrder.buyDate = tx.timestamp;

  // persist SellMembershipOrder 
          return sellMembershipOrderRegistry.update(sellMembershipOrder);    
        })
  // transfer gcoin from the buyer's wallet to the seller's and golf course's wallets
        .then(function() {
          if (buyerWallet.gcoinBalance < (sellMembershipOrder.sellPrice + sellMembershipOrder.membership.transferFee)) {
            throw new Error("Gcoin balance of the requester's wallet is less than the amount requested to sell");
          } else {
            buyerWallet.gcoinBalance -= (sellMembersipOrder.sellPrice + sellMembersipOrder.membership.transferFee);
            sellerWallet.gcoinBalance += sellMembersipOrder.sellPrice;
            courseWallet.gcoinBalance += sellMembersipOrder.membership.transferFee;
            bankWallet.gcoinBalance += gcoinRequest.amount;
            return getAssetRegistry('org.acme.gcoin.Wallet')
              .then(function(walletRegistry) {
                return walletRegistry.updateAll([sellerWallet, buyerWallet, courseWallet]);
              });
          }
        });
    });
}

/**
 * A transaction processor for TransferMembership
 * @param {org.acme.gcoin.TransferMembership} tx - the transaction instance to transfer membership to the buyer
 * @transaction
 */
function onTransferMembership(tx) {
  console.log('onTransferMembership');
  var sellMembersipOrder;
  var membership;

  // verify that the TransferMembership transaction was submitted by the golf course specified in the order
  var currentParticipantId = getCurrentParticipant();
  if (currentParticipanId !== sellMembershipOrder.membership.golfCourse.$idenfifier) {
    throw new Error('Membership transfer was not made by the golf course written in the order');
  }

  return getAssetRegistry('org.acme.gcoin.SellMembershipOrder')
    .then(function(sellMembershipOrderRegistry) {
  // verify that the specified order exists in the SellMembershipOrder registry
      if (!sellMembershipOrderRegistry.exists(tx.sellMembershipOrder.$identifier)) {
        throw new Error('membership selling order to update does not exist in the registry');
      }
      return sellMembershipOrderRegistry.get(tx.sellMembersipOrder.$idenfifier)
        .then(function(retrievedOrder) {
          sellMembershipOrder = retrievedOrder;
          membership = sellMembershipOrder.membership;

  // set sellMembershipOrder.transferDate to transaction's system timestamp
          sellMembershipOrder.transferDate = tx.timestamp;

  // persist SellMembershipOrder 
          return sellMembershipOrderRegistry.update(sellMembershipOrder);    
        })
  // transfer membership from the seller to the buyer
        .then(function() {
          membership.holder = sellMembershipOrder.buyer;
          return getAssetRegistry('org.acme.gcoin.Membership')
              .then(function(membershipRegistry) {
                return membershipRegistry.update(membership);
              });
        });
    });
}
