import type { Context } from "hono";
// @ts-ignore
import * as taskModel from "../models/taskModel.ts";

type createTask = {
    userId: number,
    title: string,
    dueDate: string
}

type getTask = {
    userId: number,
    category?: string,
}

type updateTask = {
    taskId: number
}

export const createTask = async (c: Context) => {
    try {
        const body = await c.req.json<createTask>();
        if (!body.userId || !body.title || !body.dueDate)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const task = await taskModel.createTask(body);
        return c.json({
            success: true,
            data: task,
            msg: "Created new task!",
        });
    } catch (e) {
        return c.json(
            {
                success: false,
                data: null,
                msg: `${e}`,
            },
            500
        );
    }
}

export const getTask = async (c: Context) => {
    try {
        const body = await c.req.json<getTask>()
        if (!body.userId)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const task = await taskModel.getTask(body);
        return c.json({
            success: true,
            data: task,
            msg: "found tasks!",
        });
    } catch (e) {
        return c.json(
            {
                success: false,
                data: null,
                msg: `${e}`,
            },
            500
        );
    }
}

export const updateTask = async (c: Context) => {
    try {
        const body = await c.req.json<updateTask>()
        if (!body.taskId)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const task = await taskModel.updateTask(body);
        return c.json({
            success: true,
            data: task,
            msg: "updated a task!",
        });
    } catch (e) {
        return c.json(
            {
                success: false,
                data: null,
                msg: `${e}`,
            },
            500
        );
    }
}

export const procrastinate = async (c: Context) => {
    try {
        const body = await c.req.json<updateTask>()
        if (!body.taskId)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const task = await taskModel.procrastinate(body);
        return c.json({
            success: true,
            data: task,
            msg: "procrastinated a task!",
        });
    } catch (e) {
        return c.json(
            {
                success: false,
                data: null,
                msg: `${e}`,
            },
            500
        );
    }
}

export const deleteTask = async (c: Context) => {
    try {
        const body = await c.req.json<updateTask>()
        if (!body.taskId)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const task = await taskModel.deleteTask(body);
        return c.json({
            success: true,
            data: task,
            msg: "deleted a task!",
        });
    } catch (e) {
        return c.json(
            {
                success: false,
                data: null,
                msg: `${e}`,
            },
            500
        );
    }
}