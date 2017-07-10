// External dependencies
var mongoose = require('mongoose');

// Internal dependencies
var config = require("../config/config.js");
var envConfig = config.environmentConfig();


var connectToMongo = function() {
    // Connect to DB
    var mongoURL = envConfig.dbConnectionString;
    mongoose.connect(mongoURL);
    db = mongoose.connection;
    db.on('error', function onError(err) {
        console.warn('Connection to Mongo Unsuccessful: ' + err);
    });

    // When the connection is disconnected
    db.on('disconnected', function() {
        console.info('Mongoose default connection disconnected');
    });

    // When successfully connected
    db.on('connected', function() {
        console.info('Mongoose default connection open');
    });

    db.once('open', function callback() {
        console.info('Connection to Mongo Successful');
    });
};

var Schema = mongoose.Schema;

var scheme = new Schema({
    schemeName: { type: String, require: true },
    timeStamp: { type: Date, require: true },
    isActive: { type: Boolean, default: true }
});

var sales = new Schema({
    salesName: { type: String, require: true },
    companyName: { type: String, require: true },
    mobileNumber: { type: String, require: true },
    emailId: { type: String, require: true },
    pinCode: { type: String, require: true },
    street: { type: String, require: true },
    area: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
    country: { type: String, require: true },
    password: { type: String },
    salesSALT: { type: String },
    isEmailIdVerified: { type: Boolean, default: false },
    emailToken: { type: String },
    salesCode: { type: String, require: true },
    businessType: { type: String },
    isActive: { type: Boolean, default: true },
    timeStamp: { type: Date, require: true },
    isFirstLogin: { type: Boolean, default: true },
    role: { type: String, default: "sales" }
});

// Exports modules.
module.exports.scheme = mongoose.model('scheme', scheme, 'scheme');
module.exports.sales = mongoose.model('sales', sales, 'sales');

//Mongoose Connection
module.exports.db = mongoose.connection;
module.exports.connectToMongo = connectToMongo;