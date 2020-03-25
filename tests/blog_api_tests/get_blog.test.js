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

describe('Viewing a single blog', () => {
    test('returns correct blog for a valid id', async () => {
        const blogs = await helper.blogsInDb();
        const blogToView = blogs[0];

        const response = await api.get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toEqual(blogToView);
    });

    test('responds with 404 Not Found for a non-existent id of valid format', async () => {
        const id = await helper.nonExistentId();

        await api.get(`/api/blogs/${id}`)
            .expect(404);
    });

    test('responds with 400 Bad Request for an id of invalid format', async () => {
        const id = '123465789';

        await api.get(`/api/blogs/${id}`)
            .expect(400);
    });
});

afterAll(() => {
    mongoose.connection.close();
});