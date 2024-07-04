import mongoose, { Schema, Document, Model } from "mongoose";

interface IComment extends Document {
    content: string;
    owner: mongoose.Schema.Types.ObjectId;
    recipe: mongoose.Schema.Types.ObjectId;
}

interface ICommentModel extends Model<IComment> {}

const commentSchema: Schema = new Schema({
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true,
    }
}, { timestamps: true });

export const Comment = mongoose.model<IComment, ICommentModel>("Comment", commentSchema);
export type { IComment };
