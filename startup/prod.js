const helmet = require('helmet')
const compression = require('compression')

/**
 * Configures the helmet and compression middlewares
 */
module.exports = function(app) {
    app.use(helmet())
    app.use(compression())
}