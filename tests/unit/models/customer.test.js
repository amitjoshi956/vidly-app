const { validate } = require('../../../models/customer')

describe('validate', () => {
    it('should return a validation result with error if name is not entered', () => {
        const customer = {
            phone: '',
            isGold: false
        }
        const { error } = validate(customer)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+name.+required.*/)
    })

    it('should return a validation result with error if phone is not entered', () => {
        const customer = {
            name: 'John',
            isGold: false
        }
        const { error } = validate(customer)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+phone.+required.*/)
    })

    it('should return a validation result with error if name length < 2', () => {
        const customer = {
            name: 'I',
            phone: 9012345678,
            isGold: false
        }
        const { error } = validate(customer)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+name.+length.+2.*/)
    })

    it('should return a validation result with error if name length > 50', () => {
        const customer = {
            name: 'some-dummy-name-with-length-more-than-50-characters',
            phone: 9012345678,
            isGold: false
        }
        const { error } = validate(customer)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+name.+length.+50.*/)
    })

    it('should return a validation result with error if phone number is negative', () => {
        const customer = {
            name: 'John',
            phone: -1,
            isGold: false
        }
        const { error } = validate(customer)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+phone.+positive.*/)
    })

    it('should return a validation result with error if phone is not a number', () => {
        const customer = {
            name: 'John',
            phone: '',
            isGold: false
        }
        const { error } = validate(customer)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+phone.+number.*/)
    })

    it('should return a validation result without error if genre is valid', () => {
        const customer = {
            name: 'John',
            phone: 9012345678,
            isGold: false
        }
        const { error } = validate(customer)

        expect(error).toBeNull()
    })
})