import { User } from "../../models/user.model";
import { Request, Response } from "express";

interface UserDetails {
    fullname: string,
    username: string,
    email: string,
    password: string
}

const register = async (req: Request, res: Response) => {
    try {
        const { fullname, username, email, password }: UserDetails = req.body;

        if ([fullname, username, email, password].some((field) => !field || field.trim() === "")) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            return res.status(400).json({
                message: "User with this email or username already exists"
            });
        }

        const newUser = new User({
            fullname,
            username,
            email,
            password
        });

        await newUser.save();

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({
                message: "User was created but couldn't be retrieved"
            });
        }

        return res.status(201).json({
            message: "User created successfully!",
            user: createdUser
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while registering user",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export default register;