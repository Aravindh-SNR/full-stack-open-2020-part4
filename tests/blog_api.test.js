const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany();

    for (const blog of helper.initialBlogs) {
        await new Blog(blog).save();
    }
});

test('blog list application returns correct number of blog posts in JSON format', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(helper.initialBlogs.length);
});

test('unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs');

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined();
        expect(blog._id).not.toBeDefined();
    });
});

test('new blog is saved correctly to database and total number of blogs increases by one', async () => {
    const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    };
    
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const finalBlogs = await helper.blogsInDb();
    expect(finalBlogs.length).toBe(helper.initialBlogs.length + 1);

    const contents = finalBlogs.map(blog => blog.title);
    expect(contents).toContain(newBlog.title);
});

test('likes property of a blog defaults to zero when it is missing', async () => {
    const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    };

    const response = await api.post('/api/blogs')
        .send(newBlog);

    expect(response.body.likes).toBe(0);
});

test.only('Missing title or url results in 400 Bad Request while creating a new blog', async () => {
    const blogWithoutTitle = {
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    };

    await api.post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400);

    const blogWithoutUrl = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
    };

    await api.post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400);

    const blogWithoutTitleAndUrl = {
        author: 'Edsger W. Dijkstra',
        likes: 5
    };

    await api.post('/api/blogs')
        .send(blogWithoutTitleAndUrl)
        .expect(400);
});

afterAll(() => {
    mongoose.connection.close();
});