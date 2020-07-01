const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')

// *** REST Routes ***
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password -__v')
    if(!user)
        return res.status(400).send('Invalid user id password')

    return res.send(user)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error)
        return res.status(400).send('Error: '+ error.details[0].message)

    const findUser = await User.findOne({ email: req.body.email })
    if (findUser)
        return res.status(400).send(`The user with email '${ req.body.email }' already exists`)

    const user = new User(_.pick(req.body, ['name','email','password']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user.save()

    const token = user.generateAuthToken()
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

// export the router
module.exports = router