const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')

// define Regex and corresponding error messages
const passwordRegex = /^[\S]{8,64}$/i
const emailErrorMessage = 'Email should be of the format abc-d.123@xyz.do.main'
const passwordErrorMessage = 'Password should not contain whitespace characters, and must be 8-64 characters long'

// define User schema and create model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return (value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/i).length > 0)
            },
            message: emailErrorMessage
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 64,
        validate: {
            validator: function (value) {
                return (value.match(passwordRegex) != null)
            },
            message: passwordErrorMessage
        }
    },
    isAdmin: Boolean
})
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
}
const User = mongoose.model('User', userSchema)

// *** UTILITY Function ***
function validateUser(user) {
    const schema = {
        name: Joi.string().required().min(2).max(50),
        email: Joi.string().required().email(),
        password: Joi.string().required().regex(passwordRegex)
    }

    return Joi.validate(user, schema)
}

// export User
exports.User = User
exports.validate = validateUser
exports.passwordRegex = passwordRegex