const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find();
    response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
    const blog = await new Blog(request.body).save();
    response.status(201).json(blog);
});

module.exports = blogRouter;