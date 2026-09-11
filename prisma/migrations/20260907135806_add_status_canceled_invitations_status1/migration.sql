/*
  Warnings:

  - The values [CANCELED] on the enum `Invitation_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Invitation` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
