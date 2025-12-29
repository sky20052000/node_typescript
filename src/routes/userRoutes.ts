// src/routes/student.routes.ts
import { Router } from "express";
import { validateRegisterDto } from '../middleware/validate.dto.js';
import {registerUser} from "../controller/userConttoller.js";

const userRouter = Router();

userRouter.post("/register",validateRegisterDto, registerUser);

export default userRouter;
