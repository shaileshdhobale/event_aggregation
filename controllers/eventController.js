//external dependencies
var log4js = require('log4js');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var csv=require('csvtojson');
// services
var eventService = require('../services/eventService.js');

// Internal dependencies
var constants = require('../utils/constant');


var searchEvent = function(req, res) {
    var response;
    var METHOD_NAME = "[searchEvent] ";
    var text = req.query.text;
    if(_.isEmpty(text)) {
        response = {
            status: 200,
            message: constants.BAD_REQUEST
        };
        return res.status(200).send(response);
    }
    eventService.searchEvent(text, function (error, result) {
        if(error) {
            console.error(METHOD_NAME + error);
            response = {
                status: 500,
                message: constants.INTERNAL_SERVER_ERROR
            };
            res.status(500).send(response);
        } else {
            response = {
                status: 200,
                message: constants.SEARCH_RESULT_SUCCESS,
                data: result
            };
            res.status(200).send(response);
        }
    })

};


var uploadEventDataCSVFormat = function(req, res) {
    var METHOD_NAME = "[uploadDocument] ";
    var response;
        // if (!_.isEmpty(req) && !_.isEmpty(req.files)) {
        //     var filesObj = req.files;
        // }
    var arr = [];
        async.waterfall([
            function readFileCSVFile(callback) {
                fs.readFile(__dirname + '\\..\\uploads\\places_1.csv', 'utf-8', function(error, data) {
                    if(error) {
                        console.error(METHOD_NAME + error);
                        callback(error, null);
                    } else {
                        console.log(typeof data);
                        csv({noheader:false})
                            .fromString(data)
                            .on('json',function(jsonObj){
                                console.log(jsonObj);
                                arr.push(jsonObj)
                            })
                            .on('done', function(){
                                callback(null, arr)
                            })
                    }
                })
            },
            function insertData(result, callback) {
                if(!_.isEmpty(result) && result.length > 0) {
                    eventService.insertEventData(result, function(error, result) {
                        if(error) {
                            console.error(METHOD_NAME + error);
                            callback(null, error);
                        } else {
                            callback(null, result);
                        }
                    })
                }
            }
        ], function(error, finalResult) {
            if(error) {
                response = {
                    status: 200,
                    message: constants.DOCUMENT_UPLOAD_SUCCESS,
                    data: finalResult
                };
                res.status(200).send(response);
            } else {
                // console.info(METHOD_NAME + "Document uploaded successfully - " +  filesObj[0].filename);
                response = {
                    status: 200,
                    message: constants.DOCUMENT_UPLOAD_SUCCESS,
                    data: finalResult
                };
                res.status(200).send(response);
            }
        })
}

module.exports.searchEvent = searchEvent;
module.exports.uploadEventDataCSVFormat = uploadEventDataCSVFormat;


