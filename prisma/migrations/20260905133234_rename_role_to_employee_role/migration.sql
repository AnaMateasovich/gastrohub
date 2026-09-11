/*
  Warnings:

  - You are about to drop the column `roleId` on the `Employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_roleId_fkey`;

-- DropIndex
DROP INDEX `Employee_roleId_idx` ON `Employee`;

-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `roleId`,
    ADD COLUMN `employeeRoleId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Employee_employeeRoleId_idx` ON `Employee`(`employeeRoleId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_employeeRoleId_fkey` FOREIGN KEY (`employeeRoleId`) REFERENCES `EmployeeRole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Invitation` RENAME INDEX `Invitation_employeeRoleId_fkey` TO `Invitation_employeeRoleId_idx`;
