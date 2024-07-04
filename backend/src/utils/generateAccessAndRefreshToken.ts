import { User, IUser } from "../models/user.model";

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshToken = async (userId: string): Promise<Tokens | null> => {
    try {
        const user: IUser | null = await User.findById(userId);
        
        if (!user) {
            console.log(`User not found for ID: ${userId}`);
            return null;
        }

        const accessToken: string = user.generateAccessToken();
        const refreshToken: string = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in generateAccessAndRefreshToken:", error);
        return null;
    }
};

export { generateAccessAndRefreshToken, Tokens };