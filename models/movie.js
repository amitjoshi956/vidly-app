const Joi = require('joi')
const mongoose = require('mongoose')
const { genreSchema } = require('./genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})
// define Movie schema and create model
const Movie = mongoose.model('Movie', movieSchema)

// *** UTILITY FUNCTIONS ***
function validateMovie(movie) {
    const schema = {
        title: Joi.string().required().trim().min(1).max(255),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().default(0).positive(),
        dailyRentalRate: Joi.number().default(0).positive()
    }

    return Joi.validate(movie, schema)
}

// export Movie, validateMovie
exports.Movie = Movie
exports.validate = validateMovie
exports.movieSchema = movieSchema