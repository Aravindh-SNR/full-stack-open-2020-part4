const supertest = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Blog = require('../../models/blog');
const helper = require('../test_helper');

const api = supertest(app);

// Log in to get token
beforeAll(async () => {
    const user = {
        username: 'root',
        password: 'secret'
    };

    const response = await api.post('/api/login')
        .send(user);

    helper.token = `Bearer ${response.body.token}`;
});

// Delete all documents from db and create new documents before each test is run
beforeEach(async () => {
    await Blog.deleteMany();

    for (const blog of helper.initialBlogs) {
        await new Blog(blog).save();
    }
});

describe('Creating a blog', () => {
    test('with valid data and token saves new blog correctly to database', async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5
        };
        
        await api.post('/api/blogs')
            .set('Authorization', helper.token)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    
        const finalBlogs = await helper.blogsInDb();
        expect(finalBlogs.length).toBe(helper.initialBlogs.length + 1);
    
        const contents = finalBlogs.map(blog => blog.title);
        expect(contents).toContain(newBlog.title);
    });
    
    test('saves a blog with likes property set to zero if it is missing', async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
        };
    
        const response = await api.post('/api/blogs')
            .set('Authorization', helper.token)
            .send(newBlog);
    
        expect(response.body.likes).toBe(0);
    });

    test('fails with status code 401 Unauthorized if token is missing', async () => {
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5
        };
        
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(401);
    });

    describe('responds with 400 Bad Request and does not create a new blog when', () => {
        test('title is missing', async () => {
            const blogWithoutTitle = {
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5
            };
        
            await api.post('/api/blogs')
                .set('Authorization', helper.token)
                .send(blogWithoutTitle)
                .expect(400);

            const blogsAtEnd = await helper.blogsInDb();
            expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
        });
        
        test('url is missing', async () => {
            const blogWithoutUrl = {
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                likes: 5
            };
        
            await api.post('/api/blogs')
                .set('Authorization', helper.token)
                .send(blogWithoutUrl)
                .expect(400);

            const blogsAtEnd = await helper.blogsInDb();
            expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
        });
        
        test('both title and url are missing', async () => {
            const blogWithoutTitleAndUrl = {
                author: 'Edsger W. Dijkstra',
                likes: 5
            };
        
            await api.post('/api/blogs')
                .set('Authorization', helper.token)
                .send(blogWithoutTitleAndUrl)
                .expect(400);

            const blogsAtEnd = await helper.blogsInDb();
            expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});