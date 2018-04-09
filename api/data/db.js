var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);
//listner 1
mongoose.connection.on('connected', function () {
   console.log('Mongoose connected to '+ dburl);     
});

//listner 2
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected from ' + dburl);
});

//listner 3
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

//Capture 1
process.on('SIGINT', function(){
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination (SIGNINT)');
        process.exit(0);
    });
})

//Capture 2
process.on('SIGTERM', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination (SIGTERM)');
        process.exit(0);
    });
})

//Capture 3
process.once('SIGUSR2', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination (SIGUSR2)');
        process.kill(process.pid, 'SIGUSR2');
    });
})

//Bring the schema  and Models  
require('./hotels.model.js');