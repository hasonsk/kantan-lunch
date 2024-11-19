import { validationResult } from 'express-validator';

/**
 * Validates the results of express-validator checks.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default validate;
