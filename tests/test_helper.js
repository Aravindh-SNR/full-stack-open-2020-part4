const Blog = require('../models/blog');

const initialBlogs = [
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

const blogsInDb = async () => {
    const blogs = await Blog.find();
    return blogs.map(blog => blog.toJSON());
};

module.exports = {
    initialBlogs,
    blogsInDb
};