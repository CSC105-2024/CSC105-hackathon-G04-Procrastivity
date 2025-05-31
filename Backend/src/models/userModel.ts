// @ts-ignore
import { db } from "../index.ts";

const createUser = async(body: any) => {
    const user = await db.user.create({
        data : {
            username: body.user,
            password: body.password,
            profilePicture: body.profilePicture,

        }
    })

    return user;
}

export {
    createUser
}