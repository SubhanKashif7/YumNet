import express , {Express , Request , Response} from "express"
import cors from "cors";
import userRouter from "../routes/user.routes";
import cookieParser from "cookie-parser";
import recipeRouter from "../routes/recipe.routes";
import frouter from "../controllers/firebase-controllers/firebaseLogin";
const app : Express = express();

app.use(cors());
app.use(cookieParser());

app.use(express.json({limit : "50mb"}))
app.use(express.urlencoded({limit : "50mb",extended : true}))
app.use("/api/v1/users/",userRouter);
app.use("/auth/firebase",frouter);
app.use("/api/v1/authenticated/recipe",recipeRouter);
export default app;