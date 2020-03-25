const supertest = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const helper = require('../test_helper');

const api = supertest(app);

// Delete all documents from db and create new documents before each test is run
beforeEach(async () => {
    await User.deleteMany();

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
});

describe('Creating a user', () => {
    test('with valid data saves new user correctly to database', async () => {
        const initialUsers = await helper.usersInDb();

        const newUser = {
            username: 'aravindh_snr',
            password: 'secret',
            name: 'Aravindh'
        };
        
        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    
        const finalUsers = await helper.usersInDb();
        expect(finalUsers.length).toBe(initialUsers.length + 1);
    
        const contents = finalUsers.map(user => user.username);
        expect(contents).toContain(newUser.username);
    });
    
    describe('fails and responds with correct status code and error message when', () => {
        test('username is missing', async () => {
            const initialUsers = await helper.usersInDb();
    
            const newUser = {
                password: 'secret'
            };
            
            const response = await api.post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(response.body.error).toContain('Username is required');
        
            const finalUsers = await helper.usersInDb();
            expect(finalUsers.length).toBe(initialUsers.length);
        });

        test('password is missing', async () => {
            const initialUsers = await helper.usersInDb();
    
            const newUser = {
                username: 'aravindh_snr'
            };
            
            const response = await api.post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(response.body.error).toContain('Password is required');
        
            const finalUsers = await helper.usersInDb();
            expect(finalUsers.length).toBe(initialUsers.length);
        });

        test('username is invalid', async () => {
            const initialUsers = await helper.usersInDb();
    
            const newUser = {
                username: 'me',
                password: 'secret'
            };
            
            const response = await api.post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(response.body.error).toContain('Username must have at least 3 characters');
        
            const finalUsers = await helper.usersInDb();
            expect(finalUsers.length).toBe(initialUsers.length);
        });

        test('password is invalid', async () => {
            const initialUsers = await helper.usersInDb();
    
            const newUser = {
                username: 'aravindh_snr',
                password: 'me'
            };
            
            const response = await api.post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(response.body.error).toContain('Password must have at least 3 characters');
        
            const finalUsers = await helper.usersInDb();
            expect(finalUsers.length).toBe(initialUsers.length);
        });

        test('username is duplicate', async () => {
            const initialUsers = await helper.usersInDb();
    
            const newUser = {
                username: 'root',
                password: 'secret'
            };
            
            const response = await api.post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            expect(response.body.error).toContain('`username` to be unique');
        
            const finalUsers = await helper.usersInDb();
            expect(finalUsers.length).toBe(initialUsers.length);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});