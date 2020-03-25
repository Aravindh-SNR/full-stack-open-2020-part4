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

describe('Deleting a blog', () => {
    test('works for a valid existing id and responds with 204 No Content', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const { id } = blogsAtStart[0];

        await api.delete(`/api/blogs/${id}`)
            .expect(204);
        
        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);
        
        const ids = blogsAtEnd.map(blog => blog.id);
        expect(ids).not.toContain(id);
    });

    test('responds with 204 No Content for a non-existent id of valid format', async () => {
        const id = await helper.nonExistentId();

        await api.delete(`/api/blogs/${id}`)
            .expect(204);
    });

    test('responds with 204 No Content for an id of invalid format', async () => {
        const id = '123465789';

        await api.delete(`/api/blogs/${id}`)
            .expect(400);
    });
});

afterAll(() => {
    mongoose.connection.close();
});