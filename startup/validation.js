const Joi = require('joi')

/** Returns a function that defines app validations */
module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi)
}