import { Router } from "express";
import register from "../controllers/users/register";
import multerMiddleware from "../middlewares/multer.middleware";
import login from "../controllers/users/login";
import verifyJWT from "../middlewares/auth.middleware";
import { Request , Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedReques";
const userRouter: Router = Router();


userRouter.route("/register").post(multerMiddleware.none(),register);
userRouter.route("/login").post(multerMiddleware.none(),login);
userRouter.route("/check").get(multerMiddleware.none(),verifyJWT,(req : AuthenticatedRequest , res : Response)=>{
    res.json({
        message : "Logged In",
        user : {
            user : req.user
        }

    })
    
    
})
export default userRouter
