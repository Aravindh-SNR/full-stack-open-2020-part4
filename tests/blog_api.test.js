const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Blog = require('../models/blog');

const api = supertest(app);

const list = [
    {
        "title": "What Are the React Team Principles?",
        "author": "Dan Abramov",
        "url": "https://overreacted.io/what-are-the-react-team-principles",
        "likes": 100
    },
    {
        "title": "Quick Start Guide to Typed.js with React Hooks",
        "author": "Aravindh S N R",
        "url": "https://medium.com/@aravindhsnr/quick-start-guide-to-typed-js-with-react-hooks-7035d01c73d2",
        "likes": 0
    }
];

beforeEach(async () => {
    await Blog.deleteMany();

    for (const item of list) {
        const blog = new Blog(item);
        await blog.save();
    }
});

test('blog list application returns the correct amount of blog posts in the JSON format', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(list.length);
});

afterAll(() => {
    mongoose.connection.close();
});