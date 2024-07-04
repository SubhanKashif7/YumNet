import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";
import { generateAccessAndRefreshToken, Tokens } from "../../utils/generateAccessAndRefreshToken";

const refreshAccessToken = async (req: AuthenticatedRequest, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            message: "Unauthorized Request"
        });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as jwt.JwtPayload;

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.status(401).json({
                message: "Invalid Refresh Token"
            });
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({
                message: "Refresh Token is expired or used"
            });
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const tokens = await generateAccessAndRefreshToken(String(user._id));
        
        return res.status(200)
            .cookie("accessToken", tokens?.accessToken, options)
            .cookie("refreshToken", tokens?.refreshToken, options)
            .json({
                message: "Access Token refreshed",
                tokens: {
                    accessToken: tokens?.accessToken,
                    refreshToken: tokens?.refreshToken
                }
            });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        });
    }
};

export default refreshAccessToken;
