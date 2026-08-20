-- AlterTable
ALTER TABLE `StoreSettings` ADD COLUMN `ctaLabel` VARCHAR(50) NULL,
    ADD COLUMN `heroBadgeText` VARCHAR(100) NULL,
    ADD COLUMN `heroHighlight` VARCHAR(150) NULL,
    ADD COLUMN `heroImageUrl` VARCHAR(500) NULL,
    ADD COLUMN `heroSubtitle` VARCHAR(255) NULL,
    ADD COLUMN `heroTitle` VARCHAR(150) NULL;
