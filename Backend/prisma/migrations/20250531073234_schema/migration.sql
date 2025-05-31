-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profilePicture` VARCHAR(191) NOT NULL,
    `maxXp` INTEGER NOT NULL DEFAULT 10,
    `currentXp` INTEGER NOT NULL DEFAULT 0,
    `rank` VARCHAR(191) NOT NULL DEFAULT 'Iron',
    `maxRank` BOOLEAN NOT NULL DEFAULT false,
    `taskCompleted` INTEGER NOT NULL DEFAULT 0,
    `taskProcrastinated` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `taskId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT '',
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `procrastinated` BOOLEAN NOT NULL DEFAULT false,
    `dueDate` VARCHAR(191) NOT NULL,
    `dueIn` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`taskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subTask` (
    `subTaskId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `dueDate` VARCHAR(191) NOT NULL,
    `dueIn` INTEGER NOT NULL,
    `mainTaskId` INTEGER NOT NULL,

    PRIMARY KEY (`subTaskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subTask` ADD CONSTRAINT `subTask_mainTaskId_fkey` FOREIGN KEY (`mainTaskId`) REFERENCES `Task`(`taskId`) ON DELETE RESTRICT ON UPDATE CASCADE;
