import { Hono } from "hono";
// @ts-ignore
import * as taskController from "../controllers/taskController.ts";

export const taskRouter = new Hono();

taskRouter.post('/createTask', taskController.createTask);
taskRouter.patch('/getTask', taskController.getTask);
taskRouter.patch('/updateTask', taskController.updateTask);
taskRouter.post('/procrastinate', taskController.procrastinate);
taskRouter.delete('/deleteTask', taskController.deleteTask);