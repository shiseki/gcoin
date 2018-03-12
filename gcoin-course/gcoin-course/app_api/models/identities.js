const mongoose = require( 'mongoose' );
const identitySchema = new mongoose.Schema({
    userID: {type: String, required: true},
    password: {type: String, "default": "password"},
    enrollmentId: String,
    enrollmentSecret: String,
    participantId: String
});
global.gcoinDB.model('CourseID', identitySchema, 'courseIDs');

console.log("model CourseID is created to access the collection courseIDs");
