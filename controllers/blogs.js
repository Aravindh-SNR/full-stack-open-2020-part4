const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find();
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const newBlog = await new Blog(request.body).save();
    response.status(201).json(newBlog);
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    blog ? response.json(blog) : response.status(404).json({ error: 'Blog with given id does not exist' });
});

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    updatedBlog ? response.json(updatedBlog) :
        response.status(404).json({ error: 'Blog with given id does not exist' });
});

module.exports = blogsRouter;