-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "taskId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "procrastinated" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("completed", "dueDate", "procrastinated", "taskId", "title", "userId") SELECT "completed", "dueDate", "procrastinated", "taskId", "title", "userId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "maxXp" INTEGER NOT NULL DEFAULT 10,
    "currentXp" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT 'Iron',
    "maxRank" BOOLEAN NOT NULL DEFAULT false,
    "taskCompleted" INTEGER NOT NULL DEFAULT 0,
    "taskProcrastinated" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("currentXp", "maxRank", "maxXp", "password", "profilePicture", "rank", "taskCompleted", "taskProcrastinated", "userId", "username") SELECT "currentXp", "maxRank", "maxXp", "password", "profilePicture", "rank", "taskCompleted", "taskProcrastinated", "userId", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_subTask" (
    "subTaskId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" INTEGER NOT NULL,
    "mainTaskId" INTEGER NOT NULL,
    CONSTRAINT "subTask_mainTaskId_fkey" FOREIGN KEY ("mainTaskId") REFERENCES "Task" ("taskId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subTask" ("completed", "dueDate", "mainTaskId", "subTaskId", "title") SELECT "completed", "dueDate", "mainTaskId", "subTaskId", "title" FROM "subTask";
DROP TABLE "subTask";
ALTER TABLE "new_subTask" RENAME TO "subTask";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
