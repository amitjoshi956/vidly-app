const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

/**
 * Returns a function to connect to the database
 */
module.exports = function () {
    const db = config.get('db')
    mongoose.connect(db, { 
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
        .then(() => winston.info(`Connected to ${ db } ...`))
}