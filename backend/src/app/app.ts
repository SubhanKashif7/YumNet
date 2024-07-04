import express , {Express , Request , Response} from "express"
import cors from "cors";
import userRouter from "../routes/user.routes";
import cookieParser from "cookie-parser";
const app : Express = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({limit : "15kb"}));
app.use("/api/v1/users/",userRouter);
export default app;