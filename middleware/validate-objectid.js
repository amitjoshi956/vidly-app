const mongoose = require('mongoose')

/** 
 * Returns a middleware function to verify if the id
 * in the request is a valid ObjectId
 */
module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID')

    next()
}