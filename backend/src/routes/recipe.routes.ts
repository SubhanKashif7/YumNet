import { Router } from "express";

const recipeRouter : Router = Router();
recipeRouter.route("/addRecipe").post();
export default recipeRouter