// firebaseLogin.ts

import express from 'express';
import admin from "../../firebase/firebaseAdmin"
import generateToken from '../../firebase/generateToken'; // Adjust path as necessary
import { User, IUser } from '../../models/user.model';

const router = express.Router();

router.post('/firebase-login', async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Check if user exists in your database
        let user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            // Create a new user in your database if they don't exist
            user = new User({
                email: decodedToken.email,
                // Add any other fields you need
            });
            await user.save();
        }

        // Generate your own JWT or session for the user
        const generatedToken = generateToken(user);

        res.json({ generatedToken, user });
    } catch (error) {
        console.error('Firebase login error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
