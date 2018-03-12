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

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
let config = require('config').get('gcoin-bank');
const CONNECTION_PROFILE_NAME = config.get('connectionProfile');
const businessNetworkIdentifier = config.get('businessNetworkIdentifier');
const participantId = config.get('participantId');
const participantPwd = config.get('participantPwd');

const NS = 'org.acme.gcoin';
let bizNetworkDefinition, factory;

return bizNetworkConnection.connect(CONNECTION_PROFILE_NAME, businessNetworkIdentifier, participantId, participantPwd)
.then((result)=>{
    console.log('connected to gcoin-network');
    bizNetworkDefinition = result;
    factory = bizNetworkDefinition.getFactory();
    return bizNetworkConnection.ping();
})
.then(()=> {
    console.log('ping success');

    // create the banks' wallets
    let abcbankWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@abcbank.com');
    abcbankWallet.gcoinBalance = 1000000.0;

    let jklbankWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@jklbank.com');
    jklbankWallet.gcoinBalance = 2000000.0;

    let xyztrustbankWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@xyztrustbank.com');
    xyztrustbankWallet.gcoinBalance = 1500000.0;

    // create the golfers' wallets
    let aokiWallet = factory.newResource(NS, 'Wallet', 'wallet.isao.aoki@gmail.com');
    aokiWallet.gcoinBalance = 10000.0;

    let ozakiWallet = factory.newResource(NS, 'Wallet', 'wallet.masashi.ozaki@gmail.com');
    ozakiWallet.gcoinBalance = 8000.0;

    let horiWallet = factory.newResource(NS, 'Wallet', 'wallet.kotone.hori@gmail.com');
    horiWallet.gcoinBalance = 2000.0;

    // creae the golf courses' wallets
    let blockchainccWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@blockchaincc.com');
    blockchainccWallet.gcoinBalance = 5000.0;

    let dltgcWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@dltgc.com');
    dltgcWallet.gcoinBalance = 4000.0;

    let fabricclubWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@fabricclub.com');
    fabricclubWallet.gcoinBalane = 3000.0;


    // create the banks
    let abcbank = factory.newResource(NS, 'Bank', 'gcoin@abcbank.com');
    abcbank.name = 'ABC_Bank';
    abcbank.wallet = factory.newRelationship(NS, 'Wallet', abcbankWallet.$identifier);

    let jklbank = factory.newResource(NS, 'Bank', 'gcoin@jklbank.com');
    jklbank.name = 'JKL_Bank';
    jklbank.wallet = factory.newRelationship(NS, 'Wallet', jklbankWallet.$identifier);

    let xyztrustbank = factory.newResource(NS, 'Bank', 'gcoin@xyztrustbank.com');
    xyztrustbank.name = 'XYZ_Trust_Bank';
    xyztrustbank.wallet = factory.newRelationship(NS, 'Wallet', xyztrustbankWallet.$identifier);

    // create the golfers

    let aoki = factory.newResource(NS, 'Golfer', 'isao.aoki@xmail.com');
    aoki.firstName = 'Isao';
    aoki.lastName = 'Aoki';
    aoki.age = 75;
    aoki.wallet = factory.newRelationship(NS, 'Wallet', aokiWallet.$identifier);

    let ozaki = factory.newResource(NS, 'Golfer', 'masashi.ozaki@xmail.com');
    ozaki.firstName = 'Masashi';
    ozaki.lastName = 'Ozaki';
    ozaki.age = 70;
    ozaki.wallet = factory.newRelationship(NS, 'Wallet', ozakiWallet.$identifier);

    let hori = factory.newResource(NS, 'Golfer', 'kotone.hori@xmail.com');
    hori.firstName = 'Kotone';
    hori.lastName = 'Hori';
    hori.age = 21;
    hori.wallet = factory.newRelationship(NS, 'Wallet', horiWallet.$identifier);

    // create the golf courses

    let blockchaincc = factory.newResource(NS, 'GolfCourse', 'gcoin@blockchaincc.com');
    blockchaincc.name = 'Blockchain_Country_Club';
    blockchaincc.wallet = factory.newRelationship(NS, 'Wallet', blockchainccWallet.$identifier);

    let dltgc = factory.newResource(NS, 'GolfCourse', 'gcoin@dltgc.com');
    dltgc.name = 'DLT_Golf_Course';
    dltgc.wallet = factory.newRelationship(NS, 'Wallet', dltgcWallet.$identifier);

    let fabricclub = factory.newResource(NS, 'GolfCourse', 'gcoin@fabricclub.com');
    fabricclub.name = 'Fabric_Club';
    fabricclub.wallet = factory.newRelationship(NS, 'Wallet', fabricclubWallet.$identifier);


    // create handicap certificates
    let aokiHcCert = factory.newResource(NS, 'HcCert', 'hccert.isao.aoki@gmail.com');
    aokiHcCert.golfCourse = factory.newRelationship(NS, 'GolfCourse', blockchaincc.$identifier);
    aokiHcCert.golfer = factory.newRelationship(NS, 'Golfer', aoki.$identifier);
    aokiHcCert.handicap = 0.0;
    aokiHcCert.signature = '';

    let horiHcCert = factory.newResource(NS, 'HcCert', 'hccert.kotone.hori@gmail.com');
    horiHcCert.golfCourse = factory.newRelationship(NS, 'GolfCourse', dltgc.$identifier);
    horiHcCert.golfer = factory.newRelationship(NS, 'Golfer', hori.$identifier);
    horiHcCert.handicap = 0.0;
    horiHcCert.signature = '';


    // create membership
    let blockchaincc0001 = factory.newResource(NS, 'Membership', '0001.gcoin@blockchaincc.com');
    blockchaincc0001.golfCourse = factory.newRelationship(NS, 'GolfCourse', blockchaincc.$identifier);
    blockchaincc0001.age = 20;
    blockchaincc0001.handicap = 36.0;
    blockchaincc0001.transferFee = 300.0;
    blockchaincc0001.holder = factory.newRelationship(NS, 'Golfer', aoki.$identifier);
    blockchaincc0001.signature = '';

    let blockchaincc0002 = factory.newResource(NS, 'Membership', '0002.gcoin@blockchaincc.com');
    blockchaincc0002.golfcourse = factory.newRelationship(NS, 'GolfCourse', blockchaincc.$identifier);
    blockchaincc0002.age = 20;
    blockchaincc0002.handicap = 36.0;
    blockchaincc0002.transferFee = 300.0;
    blockchaincc0002.holder = factory.newRelationship(NS, 'Golfer', hori.$identifier);
    blockchaincc0002.signature = '';


    // get the registries
    let walletRegistry;
    return bizNetworkConnection.getAssetRegistry(NS + '.Wallet')
    .then((assetRegistry) => {
        walletRegistry = assetRegistry;
        return walletRegistry.addAll([aokiWallet, ozakiWallet, horiWallet, abcbankWallet, jklbankWallet, xyztrustbankWallet]);
    })
    .then(() => {
        return bizNetworkConnection.getParticipantRegistry(NS + '.Bank');
    })
    .then((bankRegistry) => {
        return bankRegistry.addAll([abcbank, jklbank, xyztrustbank]);
    })
    .then(() => {
        return bizNetworkConnection.getParticipantRegistry(NS + '.Golfer');
    })
    .then((golferRegistry) => {
        return golferRegistry.addAll([aoki, ozaki, hori]);
    })
    .then(() => {
        return bizNetworkConnection.getParticipantRegistry(NS + '.GolfCourse');
    })
    .then((courseRegistry) => {
        return courseRegistry.addAll([blockchaincc, dltgc, fabricclub]);
    })
    .then(()=> {
        console.log('disconnected from gcoin-network');
    });
});