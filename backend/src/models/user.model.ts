import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
interface InterfaceUser extends Document {
    fullname: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    refreshToken: string;
    comparePassword(password: string): Promise<boolean>;
    generateAccessToken():Promise<string>
    generateRefreshToken():Promise<string>;
}

interface UserModel extends Model<InterfaceUser> {
    // Static methods would go here if needed
}

const userSchema: Schema = new Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"]
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    avatar: {
        type: String,
        default: ""
    },
    refreshToken: String
});

userSchema.pre("save", async function(this: InterfaceUser) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePassword = async function(this: InterfaceUser, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = async function (){

}

export const User = mongoose.model<InterfaceUser, UserModel>("User", userSchema);