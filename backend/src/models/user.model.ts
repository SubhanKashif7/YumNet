import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
    fullname: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    refreshToken: string;
    comparePassword(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

interface IUserModel extends Model<IUser> {
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

userSchema.pre("save", async function(this: IUser) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function(this: IUser): string {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string
        }
    );
};

userSchema.methods.generateRefreshToken = function(this: IUser): string {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string
        }
    );
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export type { IUser };