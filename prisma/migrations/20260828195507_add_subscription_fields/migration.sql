/*
  Warnings:

  - You are about to alter the column `plan` on the `Organization` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NULL,
    ADD COLUMN `subscriptionStatus` ENUM('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED') NOT NULL DEFAULT 'TRIALING',
    ADD COLUMN `trialEndsAt` DATETIME(3) NULL,
    MODIFY `plan` ENUM('FREE', 'STARTER', 'PRO') NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE `StoreSettings` ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `city` VARCHAR(100) NULL,
    ADD COLUMN `province` VARCHAR(100) NULL,
    ADD COLUMN `storeDescription` TEXT NULL,
    MODIFY `organizationName` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `name` VARCHAR(191) NOT NULL;
