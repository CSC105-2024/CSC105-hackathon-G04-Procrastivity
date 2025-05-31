import { Hono } from "hono";
// @ts-ignore
import * as userController from "../controllers/userController.ts";

export const userRouter = new Hono();
userRouter.post("/createUser", userController.createUser);
userRouter.get("/getUser", userController.getUser)
userRouter.patch("/updateUsername", userController.updateUsername);
userRouter.patch("/updateProfilePicture", userController.updateProfilePicture);
userRouter.patch("/updateXp", userController.updateXp);