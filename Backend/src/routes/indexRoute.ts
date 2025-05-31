import { Hono } from "hono";
// @ts-ignore
import { userRouter } from "./userRoute.ts";
// @ts-ignore
import { taskRouter } from "./taskRoute.ts";
// @ts-ignore
import { subTaskRouter } from "./subTaskRoute.ts";

const mainRouter = new Hono();

mainRouter.route("/user", userRouter);
mainRouter.route("/task", taskRouter);
mainRouter.route("/subTask", subTaskRouter);

export { mainRouter };