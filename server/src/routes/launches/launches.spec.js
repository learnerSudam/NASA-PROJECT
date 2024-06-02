const request = require('supertest');
const app = require('../../app');
const {mongoConnect,
     mongoDisconnect,
    } = require('../../services/mongo');

const {
    loadPlanetsData
} = require('../../models/planets.model');

describe('Launches API', ()=>{

    beforeAll(async() =>{
       await mongoConnect();
       await loadPlanetsData();
    });
    
    afterAll(async ()=>{
        await mongoDisconnect();
    })
    describe('Test GET /launches', () =>{
        test('It should respond with 200 success', async() =>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        })
    })
    
    
    describe('Test POST /launch', () =>{
        const completeLaunchData = {
            mission: 'URI',
            rocket: 'Agni V',
            target: 'Kepler-1649 b',
            launchDate: '16 January 2024'
        };
    
        const LaunchDataWithOutDate = {
            mission: 'URI',
            rocket: 'Agni V',
            target: 'Kepler-1649 b',
        };
    
        const launchDataWithInvalidDate = {
            mission: 'URI',
            rocket: 'Agni V',
            target: 'Kepler-1649 b',
            launchDate: 'Invalid date' 
        }
    test('It should respond with 201 created' , async() =>{
        const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect(201)
        .expect('Content-Type', /json/)
    
       const requestDate = new Date(completeLaunchData.launchDate).valueOf;
       const responseDate = new Date(response.body.launchDate).valueOf;
     expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(LaunchDataWithOutDate)
    
        
    })
    test('it should capture missing required property', async() =>{
        const response = await request(app)
        .post('/v1/launches')
        .send(LaunchDataWithOutDate)
        .expect(400)
        .expect('Content-Type', /json/)
        
        expect(response.body).toStrictEqual({
            error: 'missing property required !!'
        })
    
    });
    
    test('it should catch invalid date sent in payload',async() =>{
        const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect(400)
        .expect('Content-Type', /json/)
    
        expect(response.body).toStrictEqual({
            error: 'Invalid date !!'
        });
    })
    });
})

