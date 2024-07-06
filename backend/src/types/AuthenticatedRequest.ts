// AuthenticatedRequest.ts

import { Request } from "express";
import { IUser } from "../models/user.model";

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export type {AuthenticatedRequest};
