import { Hono } from "hono";
// @ts-ignore
import { userRouter } from "./userRoute.ts";

const mainRouter = new Hono();

mainRouter.route("/user", userRouter);

export { mainRouter };