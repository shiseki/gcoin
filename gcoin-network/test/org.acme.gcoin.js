'use strict';
/**
 * Write the unit tests for your transction processor functions here
 */

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const IdCard = require('composer-common').IdCard;
const MemoryCardStore = require('composer-common').MemoryCardStore;

const path = require('path');

require('chai').should();

const NS = 'org.acme.gcoin';
const namespace = 'org.acme.gcoin';
const assetType = 'SampleAsset';

describe('#' + namespace, () => {
    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = new MemoryCardStore();
    let adminConnection;
    let businessNetworkConnection;

    before(() => {
        // Embedded connection used for local testing
        const connectionProfile = {
            name: 'embedded',
            type: 'embedded'
        };
        // Embedded connection does not need real credentials
        const credentials = {
            certificate: 'FAKE CERTIFICATE',
            privateKey: 'FAKE PRIVATE KEY'
        };

        // PeerAdmin identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);

        const deployerCardName = 'PeerAdmin';
        adminConnection = new AdminConnection({ cardStore: cardStore });

        return adminConnection.importCard(deployerCardName, deployerCard).then(() => {
            return adminConnection.connect(deployerCardName);
        });
    });

    beforeEach(() => {
        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });

        const adminUserName = 'admin';
        let adminCardName;
        let businessNetworkDefinition;

        return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..')).then(definition => {
            businessNetworkDefinition = definition;
            // Install the Composer runtime for the new business network
            return adminConnection.install(businessNetworkDefinition.getName());
        }).then(() => {
            // Start the business network and configure an network admin identity
            const startOptions = {
                networkAdmins: [
                    {
                        userName: adminUserName,
                        enrollmentSecret: 'adminpw'
                    }
                ]
            };
            return adminConnection.start(businessNetworkDefinition, startOptions);
        }).then(adminCards => {
            // Import the network admin identity for us to use
            adminCardName = `${adminUserName}@${businessNetworkDefinition.getName()}`;
            return adminConnection.importCard(adminCardName, adminCards.get(adminUserName));
        }).then(() => {
            // Connect to the business network using the network admin identity
            return businessNetworkConnection.connect(adminCardName);
        });
    });

    describe('#requestGcoin', () => {

        it('should be able to buy or sell gcoin', () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            // create the banks' wallets
            let abcbankWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@abcbank.com');
            abcbankWallet.gcoinBalance = 1000000.0;

            let jklbankWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@jklbank.com');
            jklbankWallet.gcoinBalance = 2000000.0;

            let xyztrustbankWallet = factory.newResource(NS, 'Wallet', 'wallet.gcoin@xyztrustbank.com');
            xyztrustbankWallet.gcoinBalance = 1500000.0;

            // create the golfers' wallets
            let aokiWallet = factory.newResource(NS, 'Wallet', 'wallet.isao.aoki@xmail.com');
            aokiWallet.gcoinBalance = 10000.0;

            let ozakiWallet = factory.newResource(NS, 'Wallet', 'wallet.masashi.ozaki@xmail.com');
            ozakiWallet.gcoinBalance = 8000.0;

            let horiWallet = factory.newResource(NS, 'Wallet', 'wallet.kotone.hori@xmail.com');
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
            let aokiHcCert = factory.newResource(NS, 'HcCert', 'hccert.isao.aoki@xmail.com');
            aokiHcCert.golfCourse = factory.newRelationship(NS, 'GolfCourse', blockchaincc.$identifier);
            aokiHcCert.golfer = factory.newRelationship(NS, 'Golfer', aoki.$identifier);
            aokiHcCert.handicap = 0.0;
            aokiHcCert.signature = '';

            let horiHcCert = factory.newResource(NS, 'HcCert', 'hccert.kotone.hori@xmail.com');
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


            // create a BUY gcoin request transaction

            let createGcoinRequest = factory.newTransaction(NS, 'CreateGcoinRequest');
            createGcoinRequest.gcoinRequestId = 'gcoinRequestId001';
            createGcoinRequest.requester = factory.newRelationship(NS, 'Golfer', aoki.$identifier);
            createGcoinRequest.bank = factory.newRelationship(NS, 'Bank', abcbank.$identifier);
            createGcoinRequest.requestType = 'BUY';
            createGcoinRequest.amount = 1000.0;

            // the requestr's balance should be 10,000,000 before the transaction
            aokiWallet.gcoinBalance.should.equal(10000.0);
            // the bank's balance should be 1,000,000,000 before the transaction
            abcbankWallet.gcoinBalance.should.equal(1000000.0);

            // get the registries
            let walletRegistry;
            return businessNetworkConnection.getAssetRegistry(NS + '.Wallet')
                .then((assetRegistry) => {
                    walletRegistry = assetRegistry;
                    return walletRegistry.addAll([aokiWallet, ozakiWallet, horiWallet, abcbankWallet, jklbankWallet, xyztrustbankWallet]);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Bank');
                })
                .then((bankRegistry) => {
                    return bankRegistry.addAll([abcbank, jklbank, xyztrustbank]);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Golfer');
                })
                .then((golferRegistry) => {
                    return golferRegistry.addAll([aoki, ozaki, hori]);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(NS + '.GolfCourse');
                })
                .then((courseRegistry) => {
                    return courseRegistry.addAll([blockchaincc, dltgc, fabricclub]);
                })
                .then(() => {
                    return businessNetworkConnection.submitTransaction(createGcoinRequest);
                })
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(NS + '.GcoinRequest');
                })
                .then((gcoinRequestRegistry) => {
                    return gcoinRequestRegistry.get('gcoinRequestId001');
                })
                .then((gcoinRequest001) => {
                    let processGcoinRequest = factory.newTransaction(NS, 'ProcessGcoinRequest');
                    processGcoinRequest.gcoinRequest = factory.newRelationship(NS, 'GcoinRequest', gcoinRequest001.$identifier);
                    return businessNetworkConnection.submitTransaction(processGcoinRequest);
                })
                .then(() => {
                    return walletRegistry.get(aokiWallet.$identifier);
                })
                .then((aokiWalletAfterTx) => {
                    aokiWalletAfterTx.gcoinBalance.should.equal(11000.0);
                    return walletRegistry.get(abcbankWallet.$identifier);
                })
                .then((abcbankWalletAfterTx) => {
                    abcbankWalletAfterTx.gcoinBalance.should.equal(999000.0);
                });
        });
    });
});
