/*
  Warnings:

  - Added the required column `days` to the `MedicationSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medicationschedule` ADD COLUMN `days` VARCHAR(191) NOT NULL;
