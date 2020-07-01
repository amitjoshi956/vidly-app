const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Fawn = require('fawn')
const _ = require('lodash')
const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')

// init Fawn for transaction
Fawn.init(mongoose)

// *** REST Routes ***
router.get('/', async (req, res) => {
    const result = await Rental.find()
        .sort({ checkOut: -1 })
    return res.send(result)
})

router.get('/:id', async (req, res) => {
    const result = await Rental.findById(req.params.id)
        .sort({ checkOut: -1 })
    return res.send(result)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error)
        return res.status(400).send('Error: ' + error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
        .catch(err => { return res.status(400).send('Error: ', err.message) })
    if(!customer)
        return res.status(404).send(`No user account found with the given id: ${ req.body.customerId }`)

    const movie = await Movie.findById(req.body.movieId)
        .catch(err => { return res.status(400).send('Error: ', err.message) })
    if(!movie)
        return res.status(404).send(`No movie found with the given id: ${ req.body.movieId } `)

    if(movie.numberInStock === 0) 
        return res.status(400).send(`${ movie.title } is currently not in stock, please check back later!`)

    let rental = new Rental({
        movie: _.pick(movie, ['_id', 'title', 'dailyRentalRate']),
        customer: _.pick(customer, ['_id', 'name', 'phone', 'isGold'])
    })
    
    // update the docs in a 2-Phase-commit transaction
    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
        .run()

    return res.send(rental)
})

// export router
module.exports = router