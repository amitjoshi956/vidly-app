/**
 * Returns a function reference which is in turn
 * invoked by express while handling a route 
 */
module.exports = function (handler) {
    return (req, res, next) => {
        try {
            handler(req, res)
        }
        catch (ex) { next(ex) }
    }
}