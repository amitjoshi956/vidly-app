const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    phone: {
        type: Number,
        required: true,
        min: 1
    },
    isGold: {
        type: Boolean,
        default: false
    }
})
// define Customer schema and create model
const Customer = mongoose.model('Customer', customerSchema)

// *** UTILITY FUNCTIONS ***
function validateCustomer(customerToValidate) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.number().positive().required(),
        isGold: Joi.boolean().default(false)
    }

    return Joi.validate(customerToValidate, schema)
}

// export customerSchema, Customer and validateCustomer
exports.customerSchema = customerSchema
exports.Customer = Customer
exports.validate = validateCustomer
