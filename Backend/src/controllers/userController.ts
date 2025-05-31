import type { Context } from "hono";
// @ts-ignore
import * as userModel from "../models/userModel.ts";

type createUser = {
    username: string,
    password: string,
    profilePicture: string
}

type updateUsername = {
    userId: number,
    username: string,
}

type updateProfilePicture = {
    userId: number,
    profilePicture: string,
}

type updateXp = {
    userId: number,
    xp: number,
}

export const createUser = async (c: Context) => {
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

export const getUser = async (c: Context) => {
    try {
        const body = c.req.query("userId");
        if (body == null)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const user = await userModel.getUser(body);
        return c.json({
            success: true,
            data: user,
            msg: "found a user!",
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

export const updateUsername = async (c: Context) => {
    try {
        const body = await c.req.json<updateUsername>();
        if (!body.userId || !body.username)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const user = await userModel.updateUsername(body);
        return c.json({
            success: true,
            data: user,
            msg: "updated username!",
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

export const updateProfilePicture = async (c: Context) => {
    try {
        const body = await c.req.json<updateProfilePicture>();
        if (!body.userId || !body.profilePicture)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const user = await userModel.updateProfilePicture(body);
        return c.json({
            success: true,
            data: user,
            msg: "updated profile picture!",
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

export const updateXp = async (c: Context) => {
    try {
        const body = await c.req.json<updateXp>();
        if (!body.userId || !body.xp)
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: "Missing required fields",
                },
                400
            );
        const user = await userModel.gainXp(body);
        return c.json({
            success: true,
            data: user,
            msg: "updated XP and Rank!",
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

export const login = async (c: Context) => {
    try {
        const body = await c.req.json<{ username: string, password: string }>();
        if (!body.username || !body.password) {
            return c.json({
                success: false,
                data: null,
                msg: "Missing required fields",
            }, 400);
        }
        const user = await userModel.login(body);
        if (!user) {
            return c.json({
                success: false,
                data: null,
                msg: "Invalid username or password",
            }, 401);
        }
        return c.json({
            success: true,
            data: user,
            msg: "Login successful!",
        });
    } catch (e) {
        return c.json({
            success: false,
            data: null,
            msg: `${e}`,
        }, 500);
    }
}

