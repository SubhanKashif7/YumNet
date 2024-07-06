// verifyJWT middleware

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/user.model'; // Adjust user model import
import generateToken from '../firebase/generateToken'; // Adjust token generation function import

export interface AuthenticatedRequest extends Request {
    user?: IUser; // Adjust based on your user model interface
}

const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.accessToken || req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            throw new Error('No token found');
        }

        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { _id: string };

        if (!decodedToken._id) {
            throw new Error('Invalid token structure');
        }

        // Fetch user from database based on _id
        const user = await User.findById(decodedToken._id).select('-password -refreshToken');

        if (!user) {
            throw new Error('User not found');
        }

        // Assign user to req object
        req.user = user;

        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default verifyJWT;
