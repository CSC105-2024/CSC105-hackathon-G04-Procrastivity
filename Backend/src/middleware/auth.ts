import { verifyToken } from '../utils/jwt.js';
import {parse} from "node:url";

export const authenticate = (req, res, next) => {
    try {
        const token = parse(req.headers.cookie).token;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};