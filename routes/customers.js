const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Customer, validate } = require('../models/customer')
const _ = require('lodash')

// *** REST routes ***
router.get('/', async (req, res) => {
    const result = await Customer.find({})
        .select({ name: 1, phone: 1, isGold: 1 })
        .sort({ name: 1 })
    
    return res.send(result)
})

router.get('/:id', async(req, res) => {
    const result = await Customer.findById(req.params.id)
        .select({ name: 1, phone: 1, isGold: 1 })

    if (!result)
        return res.status(404).send('Invalid request, kindly verify the address')
    
    return res.send(result)
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if(error)
        return res.status(400).send("Error: " + error.details[0].message)

    const newCustomer = await Customer.create(_.pick(req.body, ['name', 'phone', 'isGold']))
    return res.send(newCustomer)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error)
        return res.status(400).send(error.details[0].message)
        
    const customer = await Customer.findByIdAndUpdate(req.params.id,
        _.pick(req.body, ['name', 'phone', 'isGold']),
            { new: true })
    if(!customer)
        return res.status(404).send(`No customer found with the id: ${ req.params.id }`)
   
    return res.send(customer)
})

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
        .catch(err => {
            return res.status(400).send('Error: ', err.message)
        })

    if(!customer)
        return res.status(404).send(`No customer found with the id: ${req.params.id}`)

    return res.send(customer)
})


// export the router
module.exports = router