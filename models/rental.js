const Joi = require('joi')
const mongoose = require('mongoose')
const { customerSchema } = require('./customer')
const moment = require('moment')

// define Rental schema and create model
const rentalSchema = new mongoose.Schema({
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    customer: {
        type: customerSchema,
        required: true
    },
    checkOut: {
        type: Date,
        default: Date.now
    },
    checkIn: {
         type: Date 
    },
    rentalAmount: {
        type: Number,
        min: 0
    }
})

/** 
 * Finds the rental with the provided customerId and movieId
 * @param customerId The id of the customer of this rental
 * @param movieId The id of the movie in this rental
 */
rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({ 
        'customer._id': customerId,
        'movie._id': movieId
    })
}

/**
 * Processes the return of this rental by setting the 
 * checkIn date and calculating the rental amount
 */
rentalSchema.methods.return = function () {
    this.checkIn = new Date()

    const rentalDays = moment().diff(this.checkOut, 'days')
    this.rentalAmount = (rentalDays == 0)  ? 
        this.movie.dailyRentalRate : (rentalDays * this.movie.dailyRentalRate)
}

const Rental = mongoose.model('Rental', rentalSchema)

// *** UTILITY Function ***
function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(rental, schema)
}

// export Rental and validateRental
exports.Rental = Rental
exports.validate = validateRental