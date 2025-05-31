// @ts-ignore
import { db } from "../index.ts";

const ranks = ["Iron", "Bronze", "Silver", "Gold", "Platinum"]

export const createUser = async(body: any) => {
    const user = await db.user.create({
        data : {
            username: body.username,
            password: body.password,
            profilePicture: "",
        }
    })

    return user;
}

export const getUser = async (body: any) => {
    const user = await db.user.findUnique({
        where: {
            userId:  Number(body),
        }
    })
    return user;
}

export const updateUsername = async (body: any) => {
    const user = await db.user.update({
        where: {
            userId: body.userId,
        },
        data: {
            username: body.username,
        }
    })

    return user;
}

export const updateProfilePicture = async (body: any) => {
    const user = await db.user.update({
        where: {
            userId: body.userId,
        },
        data: {
            profilePicture: body.profilePicture,
        }
    })

    return user;
}

export const gainXp = async (body: any) => {

    const gain = await db.user.update({
        where: {
            userId: body.userId
        },
        data: {
            xp: {
                increment: body.xp
            }
        }
    })

    const data = await getUser(body.userId);
    // @ts-ignore
    let xp = data.currentXp + body.xp;
    // @ts-ignore
    let maxXp = data.maxXp;
    // @ts-ignore
    let currentRank = data.rank;
    let isMax = false;
    let newRank;
    const index = ranks.indexOf(currentRank);
    //rank up
    if(xp >= maxXp) {
        xp = xp - maxXp;

        if(index < ranks.length-1) {
            newRank = ranks[index+1];
            maxXp *= 4;
        }
        //max rank
        else {
            newRank = currentRank;
            isMax = true;
        }
    }
    //derank
    else if(xp < 0) {
        //min rankwda
        if(currentRank == "Iron") {
            xp = 0;
        }
        else {ad
            maxXp /= 4;
            xp = maxXp + body.xp
            newRank = ranks[index-1]
            isMax = false;
        }
    }

    const user = await db.user.update({
        where: {
            userId: body.userId
        },
        data: {
            currentXp: xp,
            maxXp: maxXp,
            rank: newRank,
            maxRank: isMax,
        }
    })

    return user;
}