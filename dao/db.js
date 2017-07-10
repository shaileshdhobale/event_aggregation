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

var events = new Schema({
    id: { type: String, require: true },
    name: { type: String, require: true },
    city: { type: String, require: true },
    country: { type: String, require: true },
    place: { type: String, require: true },
    zip: { type: String, require: true },
    latitude: { type: String, require: true },
    longitude: { type: String, require: true },
    fan_count: { type: String, require: true },
    checkins: { type: String, require: true },
    about: { type: String },
    picture: { type: String },
    category_list: { type: String},
    email: { type: String },
    is_verified: { type: String, require: true },
    price_range: { type: String },
    phone: { type: Boolean, default: true },
    create_date: { type: Date, require: true },
    update_date: { type: Date, require: true }
});
events.index({name: "text", city: "text", country: "text", about: "text"});


// Exports modules.

module.exports.events = mongoose.model('events', events, 'events');



//Mongoose Connection
module.exports.db = mongoose.connection;
module.exports.connectToMongo = connectToMongo;