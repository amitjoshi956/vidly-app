/**
 * Returns a middleware function reference that validates the request
 *
 *  @param validator A reference of custom validator
 */
module.exports = function (validator) {
    return (req, res, next) => {
        const { error } = validator(req.body)
        if(error)
            return res.status(400).send('Error: ' + error.details[0].message)
        next()
    }
}