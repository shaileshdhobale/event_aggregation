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

/**
 * Function: To get search result without any limitation
 * @param req
 * @param res
 */
var searchEvent = function(req, res) {

    var response;
    var METHOD_NAME = "[searchEvent] ";
    var text = req.query.text;
    if(_.isEmpty(text)) {
        response = {
            status: 400,
            message: constants.BAD_REQUEST
        };
        return res.status(400).send(response);
    }

    if(_.isEmpty(text)) {
        response = {
            status: 400,
            message: constants.BAD_REQUEST
        };
        return res.status(400).send(response);
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

/**
 * Function: To upload CSV file to store File's data in DB`
 * @param req
 * @param res
 */
var uploadEventDataCSVFormat = function(req, res) {
    var METHOD_NAME = "[uploadDocument] ";
    var response;
    if (_.isEmpty(req) || _.isEmpty(req.files) || req.files.length === 0) {
        response = {
            status: 400,
            message: constants.BAD_REQUEST
        };
        return res.status(400).send(response);
    }
    var arr = [];
    async.waterfall([
        function readFileCSVFile(callback) {
            if (!_.isEmpty(req) && !_.isEmpty(req.files)) {
                fs.readFile(__dirname + '/../uploads/' + req.files[0].filename, 'utf-8', function (error, data) {
                    if (error) {
                        console.error(METHOD_NAME + error);
                        callback(error, null);
                    } else {
                        console.log(typeof data);
                        csv({noheader: false})
                            .fromString(data)
                            .on('json', function (jsonObj) {
                                arr.push(jsonObj)
                            })
                            .on('done', function () {
                                callback(null, arr)
                            })
                    }
                })
            } else {
                callback(null, null);
            }
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
            } else {
                callback(null, null);
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
        } else if(!_.isEmpty(finalResult)) {
            response = {
                status: 200,
                message: constants.DATA_UPLOADED_SUCCESS,
                data: finalResult
            };
            res.status(200).send(response);
        } else {
            response = {
                status: 200,
                message: constants.DATA_UPLOADED_FAILURE,
                data: finalResult
            };
            res.status(200).send(response);
        }
    })
};
/**
 * Function to store data in data by reading directory and added scheduler for the same
 */
var scheduleDataSaved = function() {
    var METHOD_NAME = "[scheduleDataSaved] ";
    var arr = [];
    var finalData;
    async.waterfall([
        function readDir(callback) {
            fs.readdir(__dirname + '/../uploads/', function(error, result) {
                if(error) {
                    console.error(METHOD_NAME + error);
                    callback(error, null);
                } else {
                    callback(null, result);
                }
            })
        },
        function( result, callback) {
            if(!_.isEmpty(result)) {
                async.eachSeries(result, function (filename, cb) {
                    async.waterfall([
                        function readFileCSVFile(innerCallback) {
                            fs.readFile(__dirname + '/../uploads/' + filename, 'utf-8', function (error, data) {
                                if (error) {
                                    console.error(METHOD_NAME + error);
                                    innerCallback(error, null);
                                } else {
                                    console.log(typeof data);
                                    csv({noheader: false})
                                        .fromString(data)
                                        .on('json', function (jsonObj) {
                                            arr.push(jsonObj)
                                        })
                                        .on('done', function () {
                                            innerCallback(null, arr)
                                        })
                                }
                            })
                        },
                        function insertData(result, innerCallback) {
                            if(!_.isEmpty(result) && result.length > 0) {
                                eventService.insertEventData(result, function(error, result) {
                                    if(error) {
                                        console.error(METHOD_NAME + error);
                                        innerCallback(null, error);
                                    } else {
                                        finalData = result;
                                        innerCallback(null, result);
                                    }
                                })
                            } else {
                                innerCallback(null, null);
                            }
                        }
                    ], function(error, finalResult) {
                        if(error) {
                            cb(error)
                        } else {
                            cb();
                        }

                    })
                }, function(error) {
                    if(error) {
                        console.error(METHOD_NAME + error);
                    } else {
                        console.info("All data are saved to database by reading directory.")
                        callback(null, finalData);
                    }
                })
            } else {
                console.info("Directory is empty.");
                callback(null, null);
            }
        }
    ], function (error, finalResult) {
        if(error) {
            console.error(METHOD_NAME + error);
        } else if(!_.isEmpty(finalResult)){
            console.info("All data are saved to database by reading directory.")
        } else {
            console.info("Directory is empty.")
        }
    })
};

/***
 * Function: To get search result with limitation.
 * @param req
 * @param res
 */
var searchEventByLimit = function(req, res) {

    var response;
    var METHOD_NAME = "[searchEvent] ";
    var text = req.query.text;
    var queryObj = req.query;
    queryObj.text = text;
    if(_.isEmpty(text) || _.isEmpty(queryObj.skipRecord) || _.isEmpty(queryObj.limit)) {
        response = {
            status: 400,
            message: constants.BAD_REQUEST
        };
        return res.status(400).send(response);
    }
    eventService.searchEventByLimit(queryObj, function (error, result) {
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

//Exports
module.exports.searchEvent = searchEvent;
module.exports.uploadEventDataCSVFormat = uploadEventDataCSVFormat;
module.exports.scheduleDataSaved = scheduleDataSaved;
module.exports.searchEventByLimit = searchEventByLimit;


