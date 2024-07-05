import { Recipe } from "../../models/recipe.model";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { Response } from "express";

interface RecipeDetails {
    recipeName: string;
    recipeInstructions: string;
    recipeIngredients: string;
    recipeTitle: string;
}

const addRecipe = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipeName, recipeTitle, recipeIngredients, recipeInstructions }: RecipeDetails = req.body;
        
        if ([recipeName, recipeTitle, recipeIngredients, recipeInstructions].some((field) => field.trim() === "")) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if a recipe with the same name already exists for this user
        const existingRecipe = await Recipe.findOne({ 
            recipeName: recipeName,
            owner: req.user?._id
        });

        if (existingRecipe) {
            return res.status(409).json({
                message: "A recipe with this name already exists for the user"
            });
        }

        const newRecipe = new Recipe({
            recipeName,
            recipeTitle,
            recipeIngredients,
            recipeInstructions,
            owner: req.user?._id
        });

        await newRecipe.save();

        return res.status(201).json({
            message: "Recipe added successfully",
            recipe: newRecipe
        });

    } catch (error) {
        console.error("Error adding recipe:", error);
        return res.status(500).json({
            message: "An error occurred while adding the recipe"
        });
    }
};

export default addRecipe;