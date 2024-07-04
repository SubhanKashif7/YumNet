import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { Response } from "express";
import { User } from "../../models/user.model";

interface Password {
    oldPassword: string;
    newPassword: string;
}

const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const { oldPassword, newPassword }: Password = req.body;

        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect = await user.comparePassword(oldPassword);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Old Password"
            });
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: "Password changed"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Unknown error"
        });
    }
}

export default changePassword;
