import { Request, Response } from 'express';
import { storage } from '../firebase/firebaseAdmin'; // Adjust path as per your project structure
import multer from 'multer';

// Multer configuration for file upload
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory before uploading to Firebase Storage
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
});

// Function to upload a file to Firebase Storage
export const uploadFile = async (req: Request, res: Response) => {
    try {
        const file = req.file; // File object from multer

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const bucket = storage.bucket(); // Access default storage bucket
        const storagePath = `uploads/${file.originalname}`;

        // Ensure file.buffer is properly typed or asserted
        const fileBuffer = file.buffer as Buffer; // Type assertion for file buffer

        // Upload file to Firebase Storage
        const fileUpload = await bucket.upload(fileBuffer, {
            destination: storagePath,
            metadata: {
                contentType: file.mimetype,
            },
        });

        console.log('File uploaded successfully:', fileUpload);

        // Return success response
        res.status(200).json({ message: 'File uploaded successfully', filePath: storagePath });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

// Function to retrieve a file from Firebase Storage
export const getFile = async (req: Request, res: Response) => {
    try {
        const { fileName } = req.params;
        if (!fileName) {
            return res.status(400).json({ message: 'File name is required' });
        }

        const bucket = storage.bucket(); // Access default storage bucket
        const file = bucket.file(`uploads/${fileName}`);

        const [fileExists] = await file.exists();
        if (!fileExists) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Get signed URL for the file
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // 1 hour from now
        });

        console.log('File retrieved successfully:', fileName);

        // Redirect to the signed URL to download the file
        res.redirect(signedUrl);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ error: 'Error retrieving file' });
    }
};
