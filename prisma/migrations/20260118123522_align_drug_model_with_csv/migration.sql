-- AlterTable
ALTER TABLE `drug` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `strength` VARCHAR(191) NULL,
    MODIFY `composition` VARCHAR(191) NULL,
    MODIFY `indications` VARCHAR(191) NULL,
    MODIFY `contraindications` VARCHAR(191) NULL,
    MODIFY `dosage` VARCHAR(191) NULL,
    MODIFY `warnings` VARCHAR(191) NULL,
    MODIFY `sideEffects` VARCHAR(191) NULL,
    MODIFY `interactions` VARCHAR(191) NULL,
    MODIFY `overdose` VARCHAR(191) NULL;
