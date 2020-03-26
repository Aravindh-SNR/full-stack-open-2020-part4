const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_FOR_TOKEN } = require('../utils/config');

// Get all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find().populate('user', { blogs: 0 });
    response.json(blogs);
});

// Create a new blog
blogsRouter.post('/', async (request, response) => {
    const decodedToken = jwt.verify(request.token, SECRET_FOR_TOKEN);

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
        return response.status(401).json({ error: 'Invalid user' });
    }

    request.body.user = user._id;

    const blog = new Blog(request.body);
    const savedBlog = await (await blog.save()).populate('user', { blogs: 0 }).execPopulate();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

// Get one blog
blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { blogs: 0 });
    blog ? response.json(blog) : response.status(404).json({ error: 'Blog with given id does not exist' });
});

// Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, SECRET_FOR_TOKEN);

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
        return response.status(404).json({ error: 'Blog with given id does not exist' });
    }

    if (blog.user.toString() !== decodedToken.id) {
        return response.status(401).json({ error: 'You are not authorized to delete this blog' });
    }

    await blog.remove();
    
    const user = await User.findById(decodedToken.id);
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id);
    await user.save();

    response.status(204).end();
});

// Update a blog
blogsRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    updatedBlog ? response.json(updatedBlog) :
        response.status(404).json({ error: 'Blog with given id does not exist' });
});

module.exports = blogsRouter;