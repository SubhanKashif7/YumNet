
import { User } from "../../models/user.model";
import { Request , Response } from "express";
import {generateAccessAndRefreshToken , Tokens} from "../../utils/generateAccessAndRefreshToken";
interface UserDetails{
    email : string,
    username : string,
    password : string
}



const login = async (req : Request , res : Response) => {
    const {email , username , password} : UserDetails = req.body;
    if (!(username || email)){
        return res.status(400).json({
            message : "Username or email is required"
        })
    };

    const user = await User.findOne(
        {
            $or : [{username},{email}]
        }
    );

    if (!user){
        return res.status(400).json({
            message : "User not found"
        })
    };

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid){
        return res.status(400).json({
            message : "Invalid credentials..."
        })
    };

    const tokens = await generateAccessAndRefreshToken(String(user._id));

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    };

    return res.status(200).cookie("accessToken",tokens?.accessToken,options).cookie("refreshToken",tokens?.refreshToken,options).json({
        message : "Logged In",
        user : {
            loggedInUser
        },
        tokens : {
            tokens
        }
    })


};


export default login;
