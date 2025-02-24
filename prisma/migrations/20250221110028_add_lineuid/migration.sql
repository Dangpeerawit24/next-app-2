/*
  Warnings:

  - A unique constraint covering the columns `[lineuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `lineuid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_lineuid_key` ON `User`(`lineuid`);
