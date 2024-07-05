import jwt from "jsonwebtoken";
import admin from "../firebase/firebaseAdmin"; // Ensure firebaseAdmin.ts is correctly imported with TypeScript support
import generateToken from "../firebase/generateToken";
import { User, IUser } from "../models/user.model";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
    firebaseUser?: admin.auth.DecodedIdToken;
    user?: IUser;
}

const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Check for token in cookies first, then in Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            // If no token, check Firebase token
            await verifyFirebaseToken(req, res, async () => {
                if (req.firebaseUser) {
                    // User authenticated with Firebase
                    const firebaseUser = req.firebaseUser as admin.auth.DecodedIdToken; // Cast firebaseUser to DecodedIdToken type

                    // Check if user exists in your database
                    let user = await User.findOne({ email: firebaseUser.email });

                    if (!user) {
                        // Create a new user in your database if they don't exist
                        user = new User({
                            email: firebaseUser.email,
                            // Add any other fields you need
                        });
                        await user.save();
                    }

                    // Generate your own JWT or session for the user
                    const token = generateToken(user); // Your existing token generation function

                    req.user = user; // Set user in request object
                    return next();
                }

                // Proceed without Firebase authentication if not authenticated
                return next();
            });
        } else {
            try {
                const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { _id: string };

                if (!decodedToken._id) {
                    throw new Error("Invalid token structure");
                }

                const user = await User.findById(decodedToken._id).select("-password -refreshToken");

                if (!user) {
                    throw new Error("User not found");
                }

                req.user = user;
                next();
            } catch (jwtError) {
                console.error("JWT Verification Error:", jwtError);
                return res.status(401).json({
                    message: "Invalid Access Token"
                });
            }
        }
    } catch (error) {
        console.error("Server Error in JWT Verification:", error);
        return res.status(500).json({
            message: "Internal server error during authentication"
        });
    }
};

const verifyFirebaseToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return next(); // No token, proceed to next middleware
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        next(); // Proceed to next middleware even if verification fails
    }
};

export default verifyJWT;
