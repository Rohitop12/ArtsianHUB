const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`[Error] ${err.message}`);

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
