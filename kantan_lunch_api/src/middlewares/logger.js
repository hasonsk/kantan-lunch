/**
 * Logs details of each incoming HTTP request.
 * @param {express.Request} req - The incoming request object.
 * @param {express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const logger = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.originalUrl}`);
    next();
};

export default logger;
