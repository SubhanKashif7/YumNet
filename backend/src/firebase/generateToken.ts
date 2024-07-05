import jwt from 'jsonwebtoken';

const generateToken = (user: any): string => {
    const payload = {
        userId: user.id,
        email: user.email,
        // Add more fields as needed
    };
    const options = {
        expiresIn: '1h', // Example: token expires in 1 hour
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);
    return token;
};

export default generateToken;
