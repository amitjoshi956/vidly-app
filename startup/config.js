const config = require('config')

/**
 * Returns a function that handles the app configurations
 */
module.exports = function () {
    // verify if jwtPrivateKey is set
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
    }
}