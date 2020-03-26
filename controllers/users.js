const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Get all users
usersRouter.get('/', async (request, response) => {
    const users = await User.find().populate('blogs', { likes: 0, user: 0 });
    response.json(users);
});

// Create a new user
usersRouter.post('/', async (request, response) => {
    const { username, password, name } = request.body;

    if (!password || password.trim().length < 3) {
        return response.status(400).json({ error: 'Password must have at least 3 characters' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, passwordHash, name });
    const savedUser = await user.save();

    response.status(201).json(savedUser);
});

module.exports = usersRouter;