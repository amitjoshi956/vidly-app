const express = require('express')
const router = express.Router()
const validate = require('../middleware/validate')(validateReturn)
const Joi = require('joi')
const auth = require('../middleware/auth')
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')

router.post('/', [auth, validate], async (req, res) => {
    let rental = await Rental.lookup(req.body.customerId, req.body.movieId)
    
    if(!rental)
        return res.status(404).send('Rental not found')

    if(rental.checkIn)
        return res.status(400).send('Return is already processed!')
        
    rental.return()
    await rental.save()

    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    })
        
    return res.send(rental)
})

// *** UTILITY FUNCTION ***
function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(req, schema)
}

// export the router
module.exports = router