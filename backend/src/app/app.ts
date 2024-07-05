import express , {Express , Request , Response} from "express"
import cors from "cors";
import userRouter from "../routes/user.routes";
import cookieParser from "cookie-parser";
import recipeRouter from "../routes/recipe.routes";
const app : Express = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({limit : "15kb"}));
app.use("/api/v1/users/",userRouter);
app.use("/api/v1/authenticated/recipe",recipeRouter);
export default app;