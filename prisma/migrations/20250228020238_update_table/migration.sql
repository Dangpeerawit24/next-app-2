/*
  Warnings:

  - You are about to drop the column `evidence` on the `campaign_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `campaign_transactions` DROP COLUMN `evidence`,
    ADD COLUMN `slip` VARCHAR(191) NULL;
