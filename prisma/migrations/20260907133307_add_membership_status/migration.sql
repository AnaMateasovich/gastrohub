-- AlterTable
ALTER TABLE `Membership` ADD COLUMN `deactivatedAt` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX `Membership_status_idx` ON `Membership`(`status`);
