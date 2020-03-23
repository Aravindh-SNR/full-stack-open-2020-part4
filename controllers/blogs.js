const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (request, response, next) => {
    Blog.find()
        .then(blogs => response.json(blogs))
        .catch(next);
});

blogRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body);
    blog.save()
        .then(blog => response.json(blog))
        .catch(next);
});

module.exports = blogRouter;