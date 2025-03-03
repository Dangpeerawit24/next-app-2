/*
  Warnings:

  - You are about to drop the column `details` on the `campaign` table. All the data in the column will be lost.
  - You are about to drop the column `details2` on the `campaign_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `wish` on the `campaign_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `campaign` DROP COLUMN `details`,
    ADD COLUMN `detailsbirthdate` VARCHAR(191) NULL DEFAULT 'false',
    ADD COLUMN `detailsname` VARCHAR(191) NULL DEFAULT 'false',
    ADD COLUMN `detailstext` VARCHAR(191) NULL DEFAULT 'false',
    ADD COLUMN `detailswish` VARCHAR(191) NULL DEFAULT 'false';

-- AlterTable
ALTER TABLE `campaign_transactions` DROP COLUMN `details2`,
    DROP COLUMN `wish`,
    ADD COLUMN `detailswish` VARCHAR(191) NULL;
