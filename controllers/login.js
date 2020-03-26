const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_FOR_TOKEN } = require('../utils/config');

// Log in a user
loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;
    const user = await User.findOne({ username });

    const isValid = user && password ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!isValid) {
        return response.status(401).json({ error: 'Invalid username or password' });
    }

    const userForToken = {
        id: user._id,
        username
    };

    const token = jwt.sign(userForToken, SECRET_FOR_TOKEN);

    response.json({ token, username, name: user.name });
});

module.exports = loginRouter;