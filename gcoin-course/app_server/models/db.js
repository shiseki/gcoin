var mongoose = require( 'mongoose' );
var dbURI = 'mongodb://localhost/Gcoin';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
  console.log('Gcoin-course - Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
  console.log('Gcoin-course - Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Gcoin-course - Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback){
  mongoose.connection.close(function(){
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
