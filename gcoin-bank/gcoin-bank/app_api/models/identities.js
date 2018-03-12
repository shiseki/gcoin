const mongoose = require( 'mongoose' );
const identitySchema = new mongoose.Schema({
    userID: {type: String, required: true},
    password: {type: String, "default": "password"},
    enrollmentId: String,
    enrollmentSecret: String,
    participantId: String
});
global.gcoinDB.model('BankID', identitySchema, 'bankIDs');

console.log("model BankID is created to access the collection bankIDs");
