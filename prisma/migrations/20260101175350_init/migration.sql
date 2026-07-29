-- CreateTable
CREATE TABLE `MedicationDoseLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `taken` BOOLEAN NOT NULL DEFAULT false,
    `takenAt` DATETIME(3) NULL,

    UNIQUE INDEX `MedicationDoseLog_scheduleId_date_key`(`scheduleId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MedicationDoseLog` ADD CONSTRAINT `MedicationDoseLog_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `MedicationSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicationDoseLog` ADD CONSTRAINT `MedicationDoseLog_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
