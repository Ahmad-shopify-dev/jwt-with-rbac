import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mysecretkey';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header is missing",
            data: null
        })
    };

    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Token format is not valid",
            data: null
        })
    }

    try {
        const decodeData = jwt.verify(token, JWT_SECRET);
        req.user = decodeData;
        next();
    } catch(error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying user: " + error.message,
            data: null
        })
    }
}

