import { User } from "../../models/user.model";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { Response } from "express";
const logout = async (req : AuthenticatedRequest , res : Response) => {
    try{
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $unset : {
                    refreshToken : 1
                }
            },
            {
                new : true
            }
        );

        const options = {
            httpOnly : true,
            secure : true
        };

        return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({
            message : "Loggged Out"
        })
    }catch (err){
        return res.status(500).json({
            message : "Something went wrong while logging out",
            err
        })
    }
}