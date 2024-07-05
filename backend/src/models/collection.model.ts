import mongoose , {Schema , Document , Model} from "mongoose";

interface ICollection extends Document{
    name : string;
    description : string;
    recipes : mongoose.Schema.Types.ObjectId[];
    owner : mongoose.Schema.Types.ObjectId;
};

interface ICollectionModel extends Model<ICollection> {};

const collectionSchema : Schema = new Schema({
    name : {
        type : String,
        required : [true,"Collection name is required"]
    },

    description : {
        type : String,
        default : "none"
    },

    recipes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Recipe"
        }
    ],

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true});

export const Collection = mongoose.model<ICollection,ICollectionModel>("Collection",collectionSchema);
export type {ICollection};