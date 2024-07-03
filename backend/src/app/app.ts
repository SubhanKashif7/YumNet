import express , {Express , Request , Response} from "express"
import cors from "cors";
const app : Express = express();

app.use(cors());
app.use(express.json({limit : "15kb"}));

export default app;