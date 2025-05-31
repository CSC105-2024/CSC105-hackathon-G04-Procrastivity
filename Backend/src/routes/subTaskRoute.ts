import { Hono } from "hono";
// @ts-ignore
import * as subTaskController from "../controllers/subTaskController.ts";

export const subTaskRouter = new Hono();
// @ts-ignore
subTaskRouter.patch("/updateSubTask", subTaskController.updateSubTask);