import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IRecipe extends Document {
    recipeName: string;
    recipeTitle: string;
    recipeIngredients: string;
    recipeInstructions: string;
    recipeThumbnail?: string;
    recipeVideo?: string;
    recipeLikes: number;
    view: number;
    owner : mongoose.Schema.Types.ObjectId;
}

interface IRecipeModel extends Model<IRecipe> {}

const recipeSchema: Schema = new Schema({
    recipeName: {
        type: String,
        required: [true, "Recipe name is required"],
        trim: true,
        unique : true,
        lowercase : true

    },
    recipeTitle: {
        type: String,
        required: [true, "Recipe title is required"],
        trim: true,
    },
    recipeIngredients: {
        type: String,
        required: [true, "Recipe ingredients are required"],
    },
    recipeInstructions: {
        type: String,
        required: [true, "Recipe instructions are required"],
    },
    recipeVideo: {
        type: String,
    },
    recipeThumbnail: {
        type: String,
    },
    recipeLikes: {
        type: Number,
        default: 0,
    },
    view: {
        type: Number,
        default: 0,
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

    
}, {
    timestamps: true,
});

export const Recipe = mongoose.model<IRecipe, IRecipeModel>("Recipe", recipeSchema);
export type { IRecipe };
