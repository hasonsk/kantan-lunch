/**
 * Authorization Middleware
 * Checks if the authenticated user has one of the allowed roles
 *
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user information found.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
        }

        next();
    };
};

export default authorizeRoles;