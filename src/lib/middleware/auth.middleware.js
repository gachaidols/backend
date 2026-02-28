import jsonwebtoken from 'jsonwebtoken';

// Verifies JWT from Authorization header and sets req.userId + req.userRole
export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided', code: 401 });
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token', code: 401 });
    }
};

// Only allows admin role
export const requireAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Admin access required', code: 403 });
    }
    next();
};
