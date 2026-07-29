-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `custompharmacydrug` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pharmacyId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `strength` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,

    INDEX `CustomPharmacyDrug_pharmacyId_idx`(`pharmacyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drug` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `strength` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `composition` VARCHAR(191) NOT NULL,
    `indications` VARCHAR(191) NOT NULL,
    `contraindications` VARCHAR(191) NOT NULL,
    `dosage` VARCHAR(191) NOT NULL,
    `warnings` VARCHAR(191) NOT NULL,
    `sideEffects` VARCHAR(191) NOT NULL,
    `interactions` VARCHAR(191) NOT NULL,
    `overdose` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `druginteraction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drugAId` INTEGER NOT NULL,
    `drugBId` INTEGER NOT NULL,
    `severity` VARCHAR(191) NOT NULL,
    `warning` VARCHAR(191) NOT NULL,

    INDEX `DrugInteraction_drugBId_fkey`(`drugBId`),
    UNIQUE INDEX `DrugInteraction_drugAId_drugBId_key`(`drugAId`, `drugBId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicalinfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `height` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,
    `currentMedications` VARCHAR(191) NULL,
    `chronicMedications` VARCHAR(191) NULL,
    `chronicDiseases` VARCHAR(191) NULL,
    `allergies` VARCHAR(191) NULL,

    UNIQUE INDEX `MedicalInfo_patientId_key`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicationlog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientMedicationId` INTEGER NOT NULL,
    `scheduleId` INTEGER NOT NULL,
    `takenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date` DATETIME(3) NOT NULL,

    INDEX `MedicationLog_patientMedicationId_fkey`(`patientMedicationId`),
    UNIQUE INDEX `MedicationLog_scheduleId_date_key`(`scheduleId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medicationschedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientMedicationId` INTEGER NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `taken` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MedicationSchedule_patientMedicationId_fkey`(`patientMedicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `toRole` ENUM('ADMIN', 'PATIENT', 'PHARMACIST') NULL,
    `type` ENUM('SYSTEM', 'ORDER', 'MESSAGE') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ocrscan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `pharmacyId` INTEGER NOT NULL,
    `pharmacistId` INTEGER NULL,
    `drugName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `prescriptionImage` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Order_patientId_fkey`(`patientId`),
    INDEX `Order_pharmacistId_fkey`(`pharmacistId`),
    INDEX `Order_pharmacyId_fkey`(`pharmacyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Patient_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patientmedication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dosage` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'PAUSED', 'STOPPED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PatientMedication_patientId_fkey`(`patientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pharmacist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Pharmacist_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pharmacy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `phone` VARCHAR(191) NOT NULL,
    `licenseNumber` VARCHAR(191) NOT NULL,
    `licenseIssuedAt` DATETIME(3) NOT NULL,
    `licenseExpiresAt` DATETIME(3) NOT NULL,
    `pharmacistId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pharmacy_pharmacistId_key`(`pharmacistId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pharmacystock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pharmacyId` INTEGER NOT NULL,
    `drugId` INTEGER NULL,
    `customDrugId` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,

    INDEX `PharmacyStock_customDrugId_fkey`(`customDrugId`),
    INDEX `PharmacyStock_drugId_fkey`(`drugId`),
    INDEX `PharmacyStock_pharmacyId_fkey`(`pharmacyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `translatedContent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `systemsetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'PATIENT', 'PHARMACIST') NOT NULL,
    `scope` ENUM('GLOBAL', 'USER', 'PHARMACY') NOT NULL DEFAULT 'GLOBAL',
    `userId` INTEGER NULL,
    `pharmacyId` INTEGER NULL,

    INDEX `SystemSetting_pharmacyId_fkey`(`pharmacyId`),
    INDEX `SystemSetting_userId_fkey`(`userId`),
    UNIQUE INDEX `SystemSetting_scope_role_key_pharmacyId_key`(`scope`, `role`, `key`, `pharmacyId`),
    UNIQUE INDEX `SystemSetting_scope_role_key_userId_key`(`scope`, `role`, `key`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'PATIENT', 'PHARMACIST') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `Admin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `custompharmacydrug` ADD CONSTRAINT `CustomPharmacyDrug_pharmacyId_fkey` FOREIGN KEY (`pharmacyId`) REFERENCES `pharmacy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `druginteraction` ADD CONSTRAINT `DrugInteraction_drugAId_fkey` FOREIGN KEY (`drugAId`) REFERENCES `drug`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `druginteraction` ADD CONSTRAINT `DrugInteraction_drugBId_fkey` FOREIGN KEY (`drugBId`) REFERENCES `drug`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medicalinfo` ADD CONSTRAINT `MedicalInfo_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medicationlog` ADD CONSTRAINT `MedicationLog_patientMedicationId_fkey` FOREIGN KEY (`patientMedicationId`) REFERENCES `patientmedication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medicationlog` ADD CONSTRAINT `MedicationLog_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `medicationschedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medicationschedule` ADD CONSTRAINT `MedicationSchedule_patientMedicationId_fkey` FOREIGN KEY (`patientMedicationId`) REFERENCES `patientmedication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_pharmacistId_fkey` FOREIGN KEY (`pharmacistId`) REFERENCES `pharmacist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_pharmacyId_fkey` FOREIGN KEY (`pharmacyId`) REFERENCES `pharmacy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient` ADD CONSTRAINT `Patient_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patientmedication` ADD CONSTRAINT `PatientMedication_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pharmacist` ADD CONSTRAINT `Pharmacist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pharmacy` ADD CONSTRAINT `Pharmacy_pharmacistId_fkey` FOREIGN KEY (`pharmacistId`) REFERENCES `pharmacist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pharmacystock` ADD CONSTRAINT `PharmacyStock_customDrugId_fkey` FOREIGN KEY (`customDrugId`) REFERENCES `custompharmacydrug`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pharmacystock` ADD CONSTRAINT `PharmacyStock_drugId_fkey` FOREIGN KEY (`drugId`) REFERENCES `drug`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pharmacystock` ADD CONSTRAINT `PharmacyStock_pharmacyId_fkey` FOREIGN KEY (`pharmacyId`) REFERENCES `pharmacy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `systemsetting` ADD CONSTRAINT `SystemSetting_pharmacyId_fkey` FOREIGN KEY (`pharmacyId`) REFERENCES `pharmacy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `systemsetting` ADD CONSTRAINT `SystemSetting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
