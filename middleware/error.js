const winston = require('winston')

/**
 * Returns a middleware function which can be invoked
 * from a single point to handle and log any execeptions
 * or errors in the application.
 */
module.exports = function (err, req, res, next) {
    // log the exception
    winston.error(err.message, err)
    return res.status(500).send('Something went wrong on the server...')
}