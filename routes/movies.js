const express = require('express')
const router = express.Router()
const { Genre } = require('../models/genre')
const { Movie, validate } = require('../models/movie')

// *** REST routes ***
router.get('/', async (req, res) => {
    const result = await Movie.find()
        .sort({ title: 1 })

    return res.send(result)
})


router.get('/:id', async (req, res) => {
    const result = await Movie.findById(req.params.id)
        .sort({ title: 1 })

    if (!result)
        return res.status(404).send('Invalid request, kindly verify the address')
    
    return res.send(result)
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error)
        return res.status(400).send("Error: " + error.details[0].message)

    const genre = await getGenre(req.body.genreId)
    if(!genre)
        return res.status(400).send('Invalid genre!')

    const new_movie = await Movie.create({
        title: req.body.title,
        genre: genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    return res.send(new_movie)
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)

    const genre = await getGenre(req.body.genreId)
    if(!genre)
        return res.status(400).send('Invalid genre!')
        
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true })
        
    if(!movie)
        return res.status(404).send(`No movie found with the id: ${ req.params.id }`)
   
    return res.send(movie)
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)

    if(!movie)
        return res.status(404).send(`No movie found with the id: ${ req.params.id }`)

    return res.send(movie)
})

// *** UTILITY function ***
async function getGenre(genreId) {
    return await Genre.findById(genreId).select({ _id: 1, name: 1 })
}

// export router
module.exports = router
