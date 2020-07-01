const validateObjectId = require('../middleware/validate-objectid')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Genre, validate } = require('../models/genre')
const validation = require('../middleware/validate')(validate)

// *** REST routes ***
router.get('/', async (req, res) => {
    const result = await Genre.find({})
        .select({ name: 1})
        .sort({ name: 1 })

    return res.send(result)    
})

router.get('/:id', validateObjectId, async(req, res) => {
    const result = await Genre.findById(req.params.id)
        .select({ name: 1 })

    if (!result)
        return res.status(404).send('Invalid request, kindly verify the address')
    
    return res.send(result)
})

router.post('/', [auth, validation], async (req, res) => {
    const new_genre = await Genre.create({
        name: req.body.name
    })
    return res.send(new_genre)
})

router.put('/:id', [auth, validateObjectId, validation], async (req, res) => {        
    const genre = await Genre.findByIdAndUpdate(req.params.id, 
        { name: req.body.name },
        { new: true })
            
    if(!genre)
        return res.status(404).send(`No genre found with the id: ${ req.params.id }`)
   
    return res.send(genre)
})

router.delete('/:id', [auth, validateObjectId, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre)
        return res.status(404).send(`No genre found with the id: ${ req.params.id }`)

    return res.send(genre)
})

// export the router
module.exports = router