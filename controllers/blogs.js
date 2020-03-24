const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find();
    response.json(blogs);
});

blogRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body);
    blog.save()
        .then(blog => response.json(blog))
        .catch(next);
});

module.exports = blogRouter;