// db.product.find({$text: {$search: "Britannia Pure"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})

//external dependencies
var _ = require('lodash');
//Internal dependencies
var model = require('../dao/db.js');



var insertEventData = function(insertObj, callback) {
    var METHOD_NAME = "[insertEventData] ";
    model.events.insertMany(insertObj, function (error, result) {
        if(error) {
            console.log(METHOD_NAME + error);
            callback(error, null);
        } else {
            console.log(METHOD_NAME + JSON.stringify(result));
            callback(null, result);
        }
    })
};

var searchEvent = function(searchString, callback) {
    var METHOD_NAME = "[searchEvent] ";
    model.events.find({$text: {$search: searchString}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).exec(function(error, result) {
        if(error) {
            console.log(METHOD_NAME + error);
            callback(error, null)
        } else {
            callback(null, result);
        }
    })
};

var searchEventByLimit = function(queryObj, callback) {
    var METHOD_NAME = "[searchEventByLimit] ";
    model.events.find({$text: {$search: queryObj.text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).limit(parseInt(queryObj.limit)).skip(parseInt(queryObj.skipRecord)).exec(function(error, result) {
        if(error) {
            console.log(METHOD_NAME + error);
            callback(error, null)
        } else {
            callback(null, result);
        }
    })
};
//Exports
module.exports.insertEventData = insertEventData;
module.exports.searchEvent = searchEvent;
module.exports.searchEventByLimit = searchEventByLimit;

