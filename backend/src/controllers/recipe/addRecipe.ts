import { Recipe } from "../../models/recipe.model";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { Response } from "express";

interface RecipeDetails{
    recipeName : string;
    recipeInstructions : string;
    recipeIngredients : string;
    recipeTitle : string;
}

const addRecipe = async (req : AuthenticatedRequest , res : Response) => {
    try {
        const {recipeName , recipeTitle , recipeIngredients , recipeInstructions }: RecipeDetails = req.body;
        

    } catch (error) {
        
    }
}