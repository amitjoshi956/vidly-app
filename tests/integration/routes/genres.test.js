const mongoose = require('mongoose')
const request =  require('supertest')
const { Genre } = require('../../../models/genre')
const { User } = require('../../../models/user')

const genres_endpoint = '/api/genres';
let server

describe(genres_endpoint, () => {
    beforeEach(() => { server = require('../../../app') })
    afterEach(async () => { 
        await Genre.deleteMany({})
        await server.close()
    })

    describe('GET /', () => {
        it('should return all the genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])

            const result = await request(server).get(genres_endpoint)
            
            expect(result.status).toBe(200)
            expect(result.body.length).toBe(2)
            expect(result.body.some(g => g.name === 'genre1' )).toBeTruthy()
            expect(result.body.some(g => g.name === 'genre2')).toBeTruthy()
        })
    })
    
    describe('GET /:id', () => {
        it('should return the genre for a valid id', async () => {
            const genre = await Genre.create({ name: 'genre1' })
            const id = genre._id.toHexString()

            const result = await request(server).get(`${genres_endpoint}/${id}`)

            expect(result.status).toBe(200)
            expect(result.body).toBeDefined()
            expect(result.body.name).toBe('genre1')
        })

        it('should return 404 status for an invalid id', async () => {
            const result = await request(server).get(`${genres_endpoint}/1`)
            expect(result.status).toBe(404)
        })

        it('should return 404 status if genre is not found', async () => {
            const id = mongoose.Types.ObjectId()
            const result = await request(server).get(`${genres_endpoint}/${id}`)
            expect(result.status).toBe(404)
        })
    })

    describe('POST /', () => {
        /* Define the happy path, then in each test, we change one parameter
        that clearly aligns with the name of the test */
        let token
        let name

        beforeEach(() => { 
            token = new User().generateAuthToken()
            name = 'genre1'
        })

        const exec = async () => {
            return await request(server)
                .post(genres_endpoint)
                .set('x-auth-token', token)
                .send({ name })
        } 

        it('should return a 401 status for unauthorized request', async () => {
            token = ''
            const res = await exec()
    
            expect(res.status).toBe(401)
        })
        
        it('should return a 400 status for genre name length < 3 characters', async () => {
            name = 'a'
            const res = await exec()
    
            expect(res.status).toBe(400)
        })
        
        it('should return a 400 status for genre name length > 50 characters', async () => {
            name = Array(52).join('a')
            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it('should save the genre if it is valid', async () => {
            await exec()
    
            const genre = await Genre.findOne({ name: 'genre1' })

            expect(genre).not.toBeNull()
            expect(genre).toHaveProperty('name', 'genre1')
        })

        it('should return the genre if it is valid', async () => {            
            const res = await exec()

            expect(res.body).not.toBeNull()
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        })
    })

    describe('PUT /:id', () => {
        let id
        let token
        let payload

        beforeEach(async () => {
            const genre = await Genre.create({ 
                _id: new mongoose.Types.ObjectId().toHexString(),
                name: 'genre1'
            })
            id = genre._id
            token = new User().generateAuthToken()
        })

        const exec = () => {
            return request(server)
                .put(`${genres_endpoint}/${id}`)
                .set('x-auth-token', token)
                .send(payload)
        }

        it('should return the updated genre if genre with given id is found', async () => {
            payload = { name: 'updated-genre1' }

            const result = await exec()

            expect(result).toBeDefined()
            expect(result.body).toHaveProperty('name', 'updated-genre1')
        })

        it('should return 400 status if the genre is invalid', async () => {
            payload = { name: 'a' }

            const result = await exec()

            expect(result.status).toBe(400)
        })

        it('should return 404 status if no genre with given id is found', async () => {
            id = new mongoose.Types.ObjectId().toHexString()

            payload = { name: 'updated-genre1' }

            const result = await exec()

            expect(result.status).toBe(404)
            expect(result.text).toMatch(/No genre found/)
        })
    })

    describe('DELETE /:id', () => {
        let id
        let token

        beforeEach(async () => {
            const genre = await Genre.create({ 
                _id: new mongoose.Types.ObjectId().toHexString(),
                name: 'genre1'
            })
            id = genre._id
            token = new User({ isAdmin: true }).generateAuthToken()
        })

        const exec = () => {
            return request(server)
                .delete(`${genres_endpoint}/${id}`)
                .set('x-auth-token', token)
                .send()
        }

        it('should return the deleted genre if the genre is found', async () => {
            const result = await exec()

            expect(result).toBeDefined()
            expect(result.status).toBe(200)
            expect(result.body).toHaveProperty('name', 'genre1')
        })

        it('should return 404 status if the genre is not found', async () => {
            id = new mongoose.Types.ObjectId()

            const result = await exec()

            expect(result.status).toBe(404)
            expect(result.text).toMatch(/No genre found.*/)
        })
    })
})