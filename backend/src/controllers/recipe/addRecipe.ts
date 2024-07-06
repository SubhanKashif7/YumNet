import { Request, Response } from 'express';
import { uploadFile } from '../../firebase/firebase';
import { Recipe } from "../../models/recipe.model";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import fs from 'fs';

interface RecipeDetails {
    recipeName: string;
    recipeTitle: string;
    recipeIngredients: string;
    recipeInstructions: string;
}

const addRecipe = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { recipeName, recipeTitle, recipeIngredients, recipeInstructions }: RecipeDetails = req.body;

        if (!recipeName || !recipeTitle || !recipeIngredients || !recipeInstructions) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let recipeVideoUrl = '';
        let recipeThumbnailUrl = '';

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (files['recipeVideo'] && files['recipeVideo'].length > 0) {
                const videoFile = files['recipeVideo'][0];
                if (fs.existsSync(videoFile.path)) {
                    const fileBuffer = fs.readFileSync(videoFile.path);
                    const file = new File([fileBuffer], videoFile.originalname, { type: videoFile.mimetype });
                    recipeVideoUrl = await uploadFile(file, 'recipeVideos');
                    fs.unlinkSync(videoFile.path); // Delete temp file after upload
                }
            }

            if (files['recipeThumbnail'] && files['recipeThumbnail'].length > 0) {
                const thumbnailFile = files['recipeThumbnail'][0];
                if (fs.existsSync(thumbnailFile.path)) {
                    const fileBuffer = fs.readFileSync(thumbnailFile.path);
                    const file = new File([fileBuffer], thumbnailFile.originalname, { type: thumbnailFile.mimetype });
                    recipeThumbnailUrl = await uploadFile(file, 'recipeThumbnails');
                    fs.unlinkSync(thumbnailFile.path); // Delete temp file after upload
                }
            }
        }

        const newRecipe = new Recipe({
            recipeName,
            recipeTitle,
            recipeIngredients,
            recipeInstructions,
            recipeVideoUrl,
            recipeThumbnailUrl,
            owner: req.user._id
        });

        await newRecipe.save();

        return res.status(201).json({
            message: 'Recipe added successfully',
            recipe: newRecipe
        });

    } catch (error : any) {
        console.error('Error adding recipe:', error);
        return res.status(500).json({
            message: 'An error occurred while adding the recipe',
            error: error.message
        });
    }
};

export default addRecipe;