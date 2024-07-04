import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Check for token in cookies first, then in Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized request"
            });
        }

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
    } catch (error) {
        console.error("Server Error in JWT Verification:", error);
        return res.status(500).json({
            message: "Internal server error during authentication"
        });
    }
};

export default verifyJWT;