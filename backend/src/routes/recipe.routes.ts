// recipe.routes.ts

import express from 'express';
import addRecipe from '../controllers/recipe/addRecipe';
import multerMiddleware from '../middlewares/multer.middleware';
import verifyJWT from '../middlewares/auth.middleware';

const recipeRouter = express.Router();

// Example route for adding a recipe
recipeRouter.post('/add', multerMiddleware.fields([
    {
        name: "recipeThumbnail", // Assuming this is for image/photo
        maxCount: 1
    },
    {
        name: "recipeVideo", // Assuming this is for video
        maxCount: 1
    }
]), verifyJWT,addRecipe);

export default recipeRouter;
