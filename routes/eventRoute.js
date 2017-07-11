//External dependencies
var express = require('express');
var router = express.Router();
var multer = require('multer');
var uuid = require('uuid');
var path = require('path');

// Internal dependencies
var eventController = require('../controllers/eventController.js');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, uuid.v1() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

router.get('/event/search', eventController.searchEvent);
router.get('/event/searchByLimit', eventController.searchEventByLimit);
router.post('/event/uploadFile', upload.any(), eventController.uploadEventDataCSVFormat);


//exports
module.exports = router;