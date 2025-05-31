// @ts-ignore
import { db } from "../index.ts";
import { GoogleGenAI } from "@google/genai";
import * as userModel from "../models/userModel.js"
import * as subTaskModel from "../models/subTaskModel.js"

const ai = new GoogleGenAI({ apiKey: "AIzaSyDgtUI2mGUIOLfp5M5UIU3IHYHCJmI5uYU" });

const categories = ["work", "personal", "study", "errands", "health", "finance"]

const today = new Date();

const calculateDays = (startDate: any, endDate: any) => {
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);

    let utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    let utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    let timeDiff = Math.abs(utc2 - utc1);

    let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff;
}

export const createTask = async(body: any)=> {

    const task = await db.task.create({
        data: {
            title: body.title,
            category: body.category,
            dueDate: body.dueDate,
            dueIn: calculateDays(today, body.dueDate),
            userId: body.userId
        }
    });

    return task;
}

export const getTask = async(body: any)=> {
    //update each task and subtask "duein"
    const tasks = await db.task.findMany({
        where: {
            userId: body.userId
        },
        select: {
            taskId: true,
            title: true,
            category: true,
            completed: true,
            procrastinated: true,
            dueDate: true,
            dueIn: true,
            userId: true,
            subTask: true,
        }
    })

    for(const ele of tasks) {
        await db.task.update({
            where: {
                taskId: ele.taskId
            },
            data: {
                dueIn: calculateDays(today, ele.dueDate),
            }
        })
        if(ele.procrastinated) {
            await db.subTask.updateMany({
                where: {
                    mainTaskId: ele.taskId
                },
                data: {
                    dueIn: calculateDays(today, ele.dueDate),
                }
            })
        }
    }

    // Always re-fetch the latest tasks and subtasks after updates
    if(categories.indexOf(body.category) !== -1) {
        const task = await db.task.findMany({
            where: {
                userId: body.userId,
                category: body.category.toLowerCase()
            },
            orderBy: {
              dueIn: 'asc'
            },
            select: {
                taskId: true,
                title: true,
                category: true,
                completed: true,
                procrastinated: true,
                dueDate: true,
                dueIn: true,
                userId: true,
                subTask: true,
            }
        })
        return task;
    }
    const task = await db.task.findMany({
        where: {
            userId: body.userId
        },
        orderBy: {
            dueIn: 'asc'
        },
        select: {
            taskId: true,
            title: true,
            category: true,
            completed: true,
            procrastinated: true,
            dueDate: true,
            dueIn: true,
            userId: true,
            subTask: true,
        }
    })

    return task
}

export const updateTask = async(body: any)=> {

    const task = await db.task.findUnique({
        where : {
            taskId: body.taskId,
        },
        select: {
            taskId: true,
            title: true,
            category: true,
            completed: true,
            procrastinated: true,
            dueDate: true,
            dueIn: true,
            userId: true,
            subTask: true,
        }
    })

    // @ts-ignore
    if(task.completed) {
        const updatedTask = await db.task.update({
            where: {
                taskId: body.taskId
            },
            data: {
                completed: false,
            }
        })

        await userModel.gainXp({
            // @ts-ignore
            userId: task.userId,
            xp: -1,
        })

        await db.user.update({
            where: {
                // @ts-ignore
                userId: task.userId
            },
            data: {
                taskCompleted: {
                    decrement: 1
                }
            }
        })

        return updatedTask;
    }
    else {
        const updatedTask = await db.task.update({
            where: {
                taskId: body.taskId
            },
            data: {
                completed: true,
            }
        })

        await userModel.gainXp({
            // @ts-ignore
            userId: task.userId,
            xp: 1,
        })

        await db.user.update({
            where: {
                // @ts-ignore
                userId: task.userId
            },
            data: {
                taskCompleted: {
                    increment: 1
                }
            }
        })

        const subtasks = await db.task.findFirst({
            where: {
                taskId: body.taskId
            },
            select: {
                subTask: true,
            }
        })
        // @ts-ignore
        for(const ele of subtasks.subTask) {
            await subTaskModel.updateSubTask({
                subTaskId: ele.subTaskId,
                completed: true
            })
        }

        return updatedTask;
    }

}

export const procrastinate = async(body: any)=> {
    const task = await db.task.findFirst({
        where: {
            taskId: body.taskId
        }
    })

    // @ts-ignore
    if(task.procrastinated) {
        // @ts-ignore
        return await getTask(task.userId);
    }

    const res1 = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        // @ts-ignore
        contents: `answer me in one short sentence, give me a smaller task for ${task.title}!`,
    });


    const subTask1 = await db.subTask.create({
        data: {
            // @ts-ignore
            title: res1.text,
            // @ts-ignore
            dueDate: task.dueDate,
            // @ts-ignore
            dueIn: task.dueIn,
            // @ts-ignore
            mainTaskId: task.taskId
        }
    })

    const res2 = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        // @ts-ignore
        contents: `answer me in one short sentence, give me a smaller task for ${task.title} that is not similar to ${res1.text}!`,
    });


    const subTask2 = await db.subTask.create({
        data: {
            // @ts-ignore
            title: res2.text,
            // @ts-ignore
            dueDate: task.dueDate,
            // @ts-ignore
            dueIn: task.dueIn,
            // @ts-ignore
            mainTaskId: task.taskId
        }
    })

    await db.task.update({
        where: {
            taskId: body.taskId
        },
        data: {
            procrastinated: true,
        }
    })

    await db.user.update({
        where: {
            // @ts-ignore
            userId: task.userId
        },
        data: {
            taskProcrastinated: {
                increment: 1
            }
        }
    })

    // @ts-ignore
    return await getTask(task.userId);
}

export const deleteTask = async(body: any)=> {
    const subTask = await db.subTask.deleteMany({
        where: {
            mainTaskId: body.taskId
        }
    })

    const task = await db.task.delete({
        where: {
            taskId: body.taskId
        },
        select: {
            taskId: true,
            title: true,
            category: true,
            completed: true,
            procrastinated: true,
            dueDate: true,
            dueIn: true,
            userId: true,
            subTask: true,
        }
    })

    return task;
}

