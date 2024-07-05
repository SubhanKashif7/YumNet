import mongoose , {Schema,Document,Model} from "mongoose";

interface ILike extends Document{
    recipe : mongoose.Schema.Types.ObjectId,
    comment? : mongoose.Schema.Types.ObjectId,
    likedBy : mongoose.Schema.Types.ObjectId
};

interface ILikeModel extends Model<ILike>{};

const likeSchema : Schema = new Schema({
    recipe : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Recipe"
    },
    comment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    },
    likedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true});

export const Like = mongoose.model<ILike,ILikeModel>("Like",likeSchema);
export type {ILike};