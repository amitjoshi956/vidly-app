const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, passwordRegex } = require('../models/user')

// *** REST Routes ***
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error)
        return res.status(400).send('Error: '+ error.details[0].message)

    const findUser = await User.findOne({ email: req.body.email })
    if (!findUser)
        return res.status(400).send('Invalid email address')
    
    const validPassword = await bcrypt.compare(req.body.password, findUser.password)
    if(!validPassword)
        return res.status(400).send('Invalid password')

    const token = findUser.generateAuthToken()
    return res.send(token)
})

// *** UTILITY Functions ***
function validate(req) {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().required().regex(passwordRegex)
    }

    return Joi.validate(req, schema)
}

// export the router
module.exports = router