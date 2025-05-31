import type {Context} from "hono";
import * as subTaskModel from "../models/subTaskModel.js";

type updateSubTask = {
    subTaskId: number,
    completed?: boolean,
}

export const updateSubTask = async (c: Context) => {
    try {
        const body = await c.req.json<updateSubTask>()
        if (!body.subTaskId)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const task = await subTaskModel.updateSubTask(body);
        return c.json({
            success: true,
            data: task,
            msg: "updated a sub task!",
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