import { Hono } from "hono";
// @ts-ignore
import * as userController from "../controllers/userController.ts";

const userRouter = new Hono();
userRouter.post("/createUser", userController.createUser);