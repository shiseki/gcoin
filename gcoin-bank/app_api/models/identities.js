const mongoose = require( 'mongoose' );
const identitySchema = new mongoose.Schema({
    userID: {type: String, required: true},
    password: {type: String, "default": "password"},
    userName: String,          // used to get cardName from config to get business network card
    participantId: String
});
global.gcoinDB.model('BankID', identitySchema, 'bankIDs');

console.log("model BankID is created to access the collection bankIDs");
