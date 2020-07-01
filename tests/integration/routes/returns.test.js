const moment = require('moment')
const request = require('supertest')
const { Rental } = require('../../../models/rental')
const { User } = require('../../../models/user')
const { Movie } = require('../../../models/movie')
const mongoose = require('mongoose')

describe('/api/returns', () => {
    let server
    let rental
    let customerId
    let movieId
    let movie
    let token
    
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId })
    }

    beforeEach(async () => {
        server = require('../../../app')
        
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
        token = new User().generateAuthToken()

        movie = new Movie({ 
            _id: movieId,
            title: "movie1",
            genre: {
                name: 'genre1'
            },
            numberInStock: 5,
            dailyRentalRate: 2
        })
        await movie.save()
        
        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'customer1',
                phone: 90123456789
            },
            movie: {
                _id: movieId,
                title: 'movie1',
                dailyRentalRate: 2
            }
        })
        await rental.save()
    })
    
    afterEach(async () => {
        await Rental.deleteMany({})
        await Movie.deleteMany({})
        await server.close()
    })
    
    it('should return 401 status if client is not logged in', async () => {
       token = ''

       const result = await exec()

       expect(result.status).toBe(401)
   })

   it('should return 400 status if customerId is not provided', async () => {
       customerId = ''

       const result =  await exec()

       expect(result.status).toBe(400)
   })

   it('should return 400 status if movieId is not provided', async () => {
       movieId = ''
       
       const result =  await exec()
       
       expect(result.status).toBe(400)
    })

    it('should return 404 status if no rental found for given customerId', async () => {
        customerId = mongoose.Types.ObjectId()
        
        const result =  await exec()
        
        expect(result.status).toBe(404)
     })

     it('should return 404 status if no rental found for given movieId', async () => {
        movieId = mongoose.Types.ObjectId()
        
        const result =  await exec()
        
        expect(result.status).toBe(404)
     })

     it('return 400 status if rental is already processed', async () => {
         rental.checkIn = Date.now()
         await rental.save()

         const result = await exec()

         expect(result.status).toBe(400)
     })

     it('should return updated rental with check-in date', async () => {
         const result = await exec()

         expect(result.status).toBe(200)
         const updatedRental = await Rental.findById(rental._id)
         const diff = new Date() - updatedRental.checkIn
         expect(diff).toBeLessThan(10 * 1000)
     })

     it('should return updated rental with rental amount for same day return', async () => {
         const result = await exec()

         expect(result.status).toBe(200)
         expect(result.body.rentalAmount).toBe(2)
     })

     it('should return updated rental with rental amount for more than one day return', async () => {
         rental.checkOut = moment().add(-7, 'days').toDate()
         await rental.save()
         const result = await exec()

         expect(result.status).toBe(200)
         expect(result.body.rentalAmount).toBe(14)
     })

     it('should increase the stock of movie if input is valid', async () => {
         const result = await exec()

         expect(result.status).toBe(200)
         const movieInDb = await Movie.findById(result.body.movie._id)
         expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
        })
        
        it('should return the processed rental if input is valid', async () => {
            const result = await exec()
    
            expect(result.status).toBe(200)
            expect(Object.keys(result.body))
                .toEqual(expect.arrayContaining(['movie', 'customer', 'checkOut', 'checkIn', 'rentalAmount']))
     })
})