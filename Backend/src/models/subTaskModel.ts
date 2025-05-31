import {db} from "../index.js";
import * as userModel from "./userModel.js";

export const updateSubTask = async(body: any)=> {
    const subTask = await db.subTask.findUnique({
        where : {
            subTaskId: body.subTaskId,
        },
        select: {
            subTaskId: true,
            title: true,
            completed: true,
            dueDate: true,
            dueIn: true,
            mainTaskId: true,
        }
    })

    const mainTask = await db.task.findUnique({
        where: {
            // @ts-ignore
            taskId: subTask.mainTaskId,
        }
    })
    if(body.completed) {
        // @ts-ignore
        if(!subTask.completed) {
            const updatedSubTask = await db.subTask.update({
                where: {
                    subTaskId: body.subTaskId
                },
                data: {
                    completed: true,
                }
            })

            await userModel.gainXp({
                // @ts-ignore
                userId: mainTask.userId,
                xp: 2,
            })

            return updatedSubTask;
        }
        return subTask;
    }
    // @ts-ignore
    if(subTask.completed) {
        const updatedSubTask = await db.subTask.update({
            where: {
                subTaskId: body.subTaskId
            },
            data: {
                completed: false,
            }
        })

        await userModel.gainXp({
            // @ts-ignore
            userId: mainTask.userId,
            xp: -2,
        })

        return updatedSubTask;
    }
    else {
        const updatedSubTask = await db.subTask.update({
            where: {
                subTaskId: body.subTaskId
            },
            data: {
                completed: true,
            }
        })

        await userModel.gainXp({
            // @ts-ignore
            userId: mainTask.userId,
            xp: 2,
        })

        return updatedSubTask;
    }

}