const logger = require('./logger');

const tokenExtractor = (request, response, next) => {
    const { authorization } = request.headers;

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    }

    next();
};

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method);
    logger.info('Path: ', request.path);
    logger.info('Body: ', request.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'Unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).json({ error: 'Incorrect id format' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Invalid token' });
    }

    logger.error(error.message);
    next(error);
};

module.exports = { tokenExtractor ,requestLogger, unknownEndpoint, errorHandler };