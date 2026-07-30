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
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
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
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` TEXT NULL,
    `manualCost` DECIMAL(10, 2) NULL,
    `extraCost` DECIMAL(10, 2) NULL,
    `recipeId` INTEGER NULL,
    `saleAmount` DECIMAL(10, 2) NOT NULL,
    `saleUnit` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Product_recipeId_fk`(`recipeId`),
    INDEX `Product_organizationId_idx`(`organizationId`),
    UNIQUE INDEX `Product_organizationId_slug_key`(`organizationId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductImage_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    INDEX `OrderItem_orderId_fkey`(`orderId`),
    INDEX `OrderItem_productId_fkey`(`productId`),
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

-- CreateTable
CREATE TABLE `Ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stock` DECIMAL(10, 2) NULL,
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `Ingredient_organizationId_idx`(`organizationId`),
    UNIQUE INDEX `Ingredient_organizationId_name_key`(`organizationId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `yield` DECIMAL(10, 2) NOT NULL,
    `yieldUnit` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `Recipe_organizationId_idx`(`organizationId`),
    UNIQUE INDEX `Recipe_organizationId_name_key`(`organizationId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingredientId` INTEGER NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `recipeId` INTEGER NOT NULL,

    INDEX `ingredientId`(`ingredientId`),
    INDEX `RecipeItem_recipeId_fk`(`recipeId`),
    UNIQUE INDEX `RecipeItem_recipeId_ingredientId_key`(`recipeId`, `ingredientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IngredientPriceHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingredientId` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ingredientId`(`ingredientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreSettings` (
    `organizationId` VARCHAR(191) NOT NULL,
    `deliveryFee` DECIMAL(10, 2) NOT NULL,
    `freeDeliveryFrom` DECIMAL(10, 2) NULL,
    `minimumOrderAmount` DECIMAL(10, 2) NULL,
    `storeOpen` BOOLEAN NOT NULL DEFAULT true,
    `openingTime` VARCHAR(10) NULL,
    `closingTime` VARCHAR(10) NULL,
    `whatsappPhone` VARCHAR(30) NULL,
    `storeEmail` VARCHAR(255) NULL,
    `instagramUrl` VARCHAR(255) NULL,
    `allowGuestCheckout` BOOLEAN NOT NULL DEFAULT true,
    `enableCoupons` BOOLEAN NOT NULL DEFAULT true,
    `maxDiscountPercentage` INTEGER NULL,
    `announcementBar` TEXT NULL,
    `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`organizationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `percentage` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `expiresAt` DATETIME(0) NULL,
    `maxUses` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Coupon_organizationId_code_key`(`organizationId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership` ADD CONSTRAINT `Membership_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_recipeId_fk` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ingredient` ADD CONSTRAINT `Ingredient_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeItem` ADD CONSTRAINT `RecipeItem_ibfk_2` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredient`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `RecipeItem` ADD CONSTRAINT `RecipeItem_recipeId_fk` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `IngredientPriceHistory` ADD CONSTRAINT `IngredientPriceHistory_ibfk_1` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredient`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `StoreSettings` ADD CONSTRAINT `StoreSettings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
