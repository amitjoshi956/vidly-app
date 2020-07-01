const config = require('config')
const winston = require('winston')
require('winston-mongodb') // comment this and usage if the integration test hangs the system
require('express-async-errors')

/**
 * Returns a function that handles unhandled exceptions/rejections
 * and defines transports for logging exceptions
 */
module.exports = function () {
    // handle uncaught exceptions and unhandled promise rejections
    // filepath should be relative to app.js location since this function is called during imports
    winston.handleExceptions(new winston.transports.File({ filename: config.get('uncaught-exceptions-log') }))
    winston.handleExceptions(new winston.transports.Console({ colorize: true, prettyPrint: true }))
    process.on('unhandledRejection', (ex) => { throw ex })

    // define a new transport for logging errors
    winston.add(winston.transports.File, { filename: config.get('logs-file') })
    winston.add(winston.transports.MongoDB, {
        db: config.get('db'),
        level: 'error'
    })
}