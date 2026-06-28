/*
  Warnings:

  - Added the required column `customerLastname` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `customerLastname` VARCHAR(191) NOT NULL;
