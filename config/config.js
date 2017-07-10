var envConfig = require("./envConfig.json");

// Use NODE_ENV to trump ENV Config if present
var env = process.env.NODE_ENV || envConfig.environmentType;


/**
 * environment Config
 */
var environmentConfig = function() {
    return envConfig.envConfig[env];
};

var environmentType = function() {
    return env;
};



module.exports.environmentConfig = environmentConfig;
module.exports.environmentType = environmentType;
