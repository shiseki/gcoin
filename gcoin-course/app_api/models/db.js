const mongoose = require( 'mongoose' );
const dbURI = 'mongodb://localhost/Gcoin';
const options = { promiseLibrary: require('bluebird')};
const gcoinDB = mongoose.createConnection(dbURI, options);
global.gcoinDB = gcoinDB;

gcoinDB.on('connected', function(){
  console.log('Gcoin-course - Mongoose connected to ' + dbURI);
  require('./identities');
});
gcoinDB.on('error', function(err){
  console.log('Gcoin-course - Mongoose connection error: ' + err);
});
gcoinDB.on('disconnected', function(){
  console.log('Gcoin-course - Mongoose disconnected');
});

const gracefulShutdown = function(msg, callback){
  gcoinDB.close(function(){
    console.log('Gcoin-course - Mongoose disconnected through ' + msg);
    callback();
  });
};

process.once('SIGUSR2', function(){
  gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', function(){
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});

process.on('SIGTERM', function(){
  gracefulShutdown('Bluemix app shutdown', function(){
    process.exit(0);
  });
});
