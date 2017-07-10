/**
 * Created by spdpl9 on 2/8/17.
 */

//external dependencies
var log4js = require('log4js');
var _ = require('lodash');
var async = require('async');

// services
var eventService = require('../services/eventService.js');

// Internal dependencies
var constants = require('../utils/constant');


var searchEvent = function(req, res) {
    var response;
    var text = req.param.text;
    if(_.isEmpty(text)) {
        response = {
            status: 200,
            message: constants.BAD_REQUEST
        };
        return res.status(200).send(response);
    }


};


module.exports.searchEvent = searchEvent;


