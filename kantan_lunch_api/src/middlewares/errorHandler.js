/**
 * Handles errors centrally and sends appropriate responses.
 * @param {Error} err - The error object.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;
