const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
    {
        title: "What Are the React Team Principles?",
        author: "Dan Abramov",
        url: "https://overreacted.io/what-are-the-react-team-principles",
        likes: 100
    },
    {
        title: "Quick Start Guide to Typed.js with React Hooks",
        author: "Aravindh S N R",
        url: "https://medium.com/@aravindhsnr/quick-start-guide-to-typed-js-with-react-hooks-7035d01c73d2",
        likes: 0
    }
];

const blogsInDb = async () => {
    const blogs = await Blog.find();
    return blogs.map(blog => blog.toJSON());
};

const nonExistentId = async () => {
    const nonExistentBlog = {
        title: "Soon to be deleted",
        author: "Anonymous",
        url: "https://google.com",
        likes: 1
    }

    const blog = await new Blog(nonExistentBlog).save();
    await Blog.findByIdAndDelete(blog.id);
    return blog.id;
};

const usersInDb = async () => {
    const users = await User.find();
    return users.map(user => user.toJSON());
};

module.exports = {
    initialBlogs,
    blogsInDb,
    nonExistentId,
    usersInDb
};