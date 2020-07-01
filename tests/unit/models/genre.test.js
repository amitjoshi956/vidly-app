const { validate } = require('../../../models/genre')

describe('validate', () => {
    it('should return a validation result with error if name is not entered', () => {
        const genre = {}
        const { error } = validate(genre)
        
        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+name.+required.*/)
    })

    it('should return a validation result with error if name is empty', () => {
        const genre = { name: "" }
        const { error } = validate(genre)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+name.+empty.*/)
    })
  
    it('should return a validation result with error if name length < 3', () => {
        const genre = { name: "Jo" }
        const { error } = validate(genre)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+length.+3.*/)
    })

    it('should return a validation result with error if name length > 50', () => {
        const genre = { name: "some-dummy-name-with-length-more-than-50-characters" }
        const { error } = validate(genre)

        expect(error).toBeDefined()
        expect(error.message).toMatch(/.+length.+50.*/)
    })

    it('should return a validation result without error if name is valid', () => {
        const genre = { name: "John" }
        const { error } = validate(genre)

        expect(error).toBeNull()
    })
    
})