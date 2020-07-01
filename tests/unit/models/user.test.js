const { User, validate } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new User(payload)
        const resultToken = user.generateAuthToken()
        const decoded = jwt.verify(resultToken, config.get('jwtPrivateKey'))

        expect(decoded).toMatchObject(decoded)
    })
})

describe('validate', () => {
    it('should return a validation result with error if name is not entered', () => {
        const user = {
            email: "dummy-mail",
            password: "dummy-password"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+name.+required.*/)
    })

    it('should return a validation result with error if email is not entered', () => {
        const user = {
            name: "dummy-name",
            password: "dummy-password"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+email.+required.*/)

    })

    it('should return a validation result with error if password is not entered', () => {
        const user = {
            name: "dummy-name",
            email: "abc@xyz.com"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+password.+required.*/)
    })

    it('should return a validation result with error if name is empty', () => {
        const user = {
            name: "",
            email: "abc@xyz.com"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+name.+empty.*/)
    })

    it('should return a validation result with error if length of name < 2 characters', () => {
        const user = {
            name: "i",
            email: "abc@xyz.com"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+name.+length.+2.*/)
    })

    it('should return a validation result with error if length of name > 50 characters', () => {
        const user = {
            name: "dummy-name-having-more-than-50-characters-is-too-long",
            email: "abc@xyz.com"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+name.+length.+50.*/)
    })

    it('should return a validation result with error if email is invalid', () => {
        const user = {
            name: "dummy-name",
            email: "invalid_email.com"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+email.+valid.*/)
    })

    it('should return a validation result with error if password is invalid', () => {
        const user = {
            name: "dummy-name",
            email: "abc@xyz.com",
            password: "invalid password"
        }

        const { error } = validate(user)
        expect(error).toBeDefined()  
        expect(error.message).toMatch(/.+password.+valid.*/)
    })

    it('should return a validation result with error if length of name > 50 characters', () => {
        const user = {
            name: "John Doe",
            email: "abc@xyz.com",
            password: "agoodpassword"
        }

        const { error } = validate(user)
        expect(error).toBeNull()
    })
})