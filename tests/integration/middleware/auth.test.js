const request = require('supertest')
const { User } = require('../../../models/user')
const { Genre } = require('../../../models/genre')

let server

describe('middleware/auth', () => {
    let token
    
    beforeEach(() => {
        server  = require('../../../app')
        token = new User().generateAuthToken()
    })

    afterEach(async () => {
        await Genre.deleteMany({})
        await server.close()
    })

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' })
    }

    it('should return 401 status if the token is not provided', async () => {
        token = ''

        const res = await exec()

        expect(res.status).toBe(401)
        expect(res.text).toMatch(/Access denied.*/)
    })

    it('should return 400 status if the token is invalid', async () => {
        token = 'invalid-token'

        const res = await exec()

        expect(res.status).toBe(400)
        expect(res.text).toBe('Invalid token!')
    })

    it('should return 200 status if the token is valid', async () => {
        const res = await exec()

        expect(res.status).toBe(200)
    })
})