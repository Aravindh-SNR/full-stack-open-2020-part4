const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find().populate('user', { blogs: 0 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const firstUser = await User.findOne();
    request.body.user = firstUser._id;

    const blog = new Blog(request.body);
    const savedBlog = await (await blog.save()).populate('user', { blogs: 0 });

    firstUser.blogs = firstUser.blogs.concat(savedBlog._id);
    await firstUser.save();

    response.status(201).json(savedBlog);
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { blogs: 0 });
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