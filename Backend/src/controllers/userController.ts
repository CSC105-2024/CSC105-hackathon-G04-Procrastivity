import type { Context } from "hono";
import * as userModel from "../models/userModel.ts";

type createUser = {
    username: string,
    password: string,
    profilePicture: string
}

const createUser = async (c: Context) => {
    try {
        const body = await c.req.json<createUser>();
        if (!body.username || !body.password)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const user = await userModel.createUser(body);
        return c.json({
            success: true,
            data: user,
            msg: "Created new user!",
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

export {
    createUser
}