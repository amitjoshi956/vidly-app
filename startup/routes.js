const express = require('express')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const rentals = require('../routes/rentals')
const movies = require('../routes/movies')
const users = require('../routes/users')
const auth = require('../routes/auth')
const returns = require('../routes/returns')
const error = require('../middleware/error')

/**
 * Returns a function reference that manages route middlewares
 * @param app the app instance
 */
module.exports = function (app) {
    app.use(express.json())
    // app.use(express.urlencoded({extended: true}))

    // manage routes
    app.use('/api/genres', genres)
    app.use('/api/customers', customers)
    app.use('/api/movies', movies)
    app.use('/api/rentals', rentals)
    app.use('/api/users', users)
    app.use('/api/auth', auth)
    app.use('/api/returns', returns)
    
    // error handling and logging middleware - always the last middleware
    app.use(error)
}