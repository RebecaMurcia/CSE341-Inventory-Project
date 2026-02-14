const errorHandler = (err, req, res, next) => {
// Log to console for the developer
console.error(err.stack);

let error = { ...err };
error.message = err.message;

// Mongoose Bad ObjectId (e.g., /api/items/not-a-real-id)
if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
}

// Mongoose Duplicate Key (e.g., trying to create an item with a unique name that exists)
if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
}

// Mongoose Validation Error (fallback if express-validator misses something)
if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.statusCode = 400;
}

res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
});
};

module.exports = errorHandler;