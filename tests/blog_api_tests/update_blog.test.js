const supertest = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Blog = require('../../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

// Delete all documents from db and create new documents before each test is run
beforeEach(async () => {
    await Blog.deleteMany();

    for (const blog of helper.initialBlogs) {
        await new Blog(blog).save();
    }
});

describe('Updating a blog', () => {
    test('returns blog with updated likes for a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];
        const likes = 5;

        await api.put(`/api/blogs/${blogToUpdate.id}`)
            .send({ likes })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
        expect(updatedBlog.likes).toBe(likes);
    });

    test('responds with 404 Not Found for a non-existent id of valid format', async () => {
        const id = await helper.nonExistentId();

        await api.put(`/api/blogs/${id}`)
            .expect(404);
    });

    test('responds with 400 Bad Request for an id of invalid format', async () => {
        const id = '123465789';

        await api.put(`/api/blogs/${id}`)
            .expect(400);
    });
});

afterAll(() => {
    mongoose.connection.close();
});