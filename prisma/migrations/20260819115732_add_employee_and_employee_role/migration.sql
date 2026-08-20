/*
  Warnings:

  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `role`,
    ADD COLUMN `roleId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `EmployeeRole` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    INDEX `EmployeeRole_organizationId_idx`(`organizationId`),
    UNIQUE INDEX `EmployeeRole_organizationId_name_key`(`organizationId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Employee_roleId_idx` ON `Employee`(`roleId`);

-- AddForeignKey
ALTER TABLE `EmployeeRole` ADD CONSTRAINT `EmployeeRole_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `EmployeeRole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
