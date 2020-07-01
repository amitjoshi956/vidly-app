const mongoose = require('mongoose')
const Joi = require('joi')

// define Genre schema and create model
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
})
const Genre = mongoose.model('Genre', genreSchema)

// *** UTILITY FUNCTIONS ***
function validateGenre(genreToValidate) {
    const schema = {
        name: Joi.string().min(3).max(50).required()
    }

    return Joi.validate(genreToValidate, schema)
}

// export Genre, validateGenre, and genreSchema
exports.genreSchema = genreSchema
exports.Genre = Genre
exports.validate = validateGenre