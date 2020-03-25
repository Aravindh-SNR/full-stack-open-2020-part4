const supertest = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Blog = require('../../models/blog');
const helper = require('../test_helper');

const api = supertest(app);

// Delete all documents from db and create new documents before each test is run
beforeEach(async () => {
    await Blog.deleteMany();

    for (const blog of helper.initialBlogs) {
        await new Blog(blog).save();
    }
});

describe('Blog application', () => {
    test('returns blog posts in JSON format', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('returns correct number of blog posts', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body.length).toBe(helper.initialBlogs.length);
    });
    
    test('returns blog posts whose unique identifier property is named id', async () => {
        const response = await api.get('/api/blogs');
        response.body.forEach(blog => {
            expect(blog.id).toBeDefined();
            expect(blog._id).not.toBeDefined();
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});