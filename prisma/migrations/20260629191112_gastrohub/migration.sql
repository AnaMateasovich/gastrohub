/*
  Warnings:

  - The primary key for the `StoreSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StoreSettings` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId,code]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `StoreSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropIndex
DROP INDEX `code` ON `Coupon`;

-- DropIndex
DROP INDEX `Product_slug_key` ON `Product`;

-- AlterTable
ALTER TABLE `Coupon` ADD COLUMN `organizationId` VARCHAR(191) NOT NULL,
    MODIFY `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Ingredient` ADD COLUMN `organizationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `organizationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `organizationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `StoreSettings` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `organizationId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`organizationId`);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `address`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `lastname`,
    DROP COLUMN `name`,
    DROP COLUMN `phone`,
    DROP COLUMN `role`,
    ALTER COLUMN `password` DROP DEFAULT;

-- DropTable
DROP TABLE `Orders`;

-- CreateTable
CREATE TABLE `Organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `plan` VARCHAR(191) NOT NULL DEFAULT 'free',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Organization_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Membership` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',

    UNIQUE INDEX `Membership_userId_organizationId_key`(`userId`, `organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,

    INDEX `Customer_organizationId_idx`(`organizationId`),
    UNIQUE INDEX `Customer_organizationId_email_key`(`organizationId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationId` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerLastname` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PREPARING', 'READY', 'CANCELLED', 'SHIPPED', 'PICKEDUP') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `address` VARCHAR(191) NOT NULL DEFAULT '',
    `customerId` VARCHAR(191) NULL,
    `subtotal` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,
    `deliveryFee` DECIMAL(10, 2) NULL,
    `discount` DECIMAL(10, 2) NULL,
    `note` TEXT NULL,

    INDEX `Order_customerId_fkey`(`customerId`),
    INDEX `Order_organizationId_idx`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Coupon_organizationId_code_key` ON `Coupon`(`organizationId`, `code`);

-- CreateIndex
CREATE INDEX `Ingredient_organizationId_idx` ON `Ingredient`(`organizationId`);

-- CreateIndex
CREATE INDEX `Product_organizationId_idx` ON `Product`(`organizationId`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_organizationId_slug_key` ON `Product`(`organizationId`, `slug`);

-- CreateIndex
CREATE INDEX `Recipe_organizationId_idx` ON `Recipe`(`organizationId`);

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingredient` ADD CONSTRAINT `Ingredient_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreSettings` ADD CONSTRAINT `StoreSettings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `email` TO `User_email_key`;
