-- CreateTable
CREATE TABLE `Salesperson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `employeeNumber` INTEGER NULL,
    `payPlan` VARCHAR(191) NULL,
    `demoAllowed` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Salesperson_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinanceManager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `FinanceManager_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealDate` DATETIME(3) NULL,
    `bank` VARCHAR(191) NULL,
    `fundedDate` DATETIME(3) NULL,
    `stockNo` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `salespersonId` INTEGER NULL,
    `financeManagerId` INTEGER NULL,
    `dealType` VARCHAR(191) NULL,
    `usedCarSource` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `split` DECIMAL(65, 30) NULL,
    `feGross` DECIMAL(65, 30) NULL,
    `avp` DECIMAL(65, 30) NULL,
    `beGross` DECIMAL(65, 30) NULL,
    `reserveAmt` DECIMAL(65, 30) NULL,
    `rewardsAmt` DECIMAL(65, 30) NULL,
    `vscAmt` DECIMAL(65, 30) NULL,
    `maintenanceAmt` DECIMAL(65, 30) NULL,
    `gapAmt` DECIMAL(65, 30) NULL,
    `cilajetAmt` DECIMAL(65, 30) NULL,
    `lojackAmt` DECIMAL(65, 30) NULL,
    `keyAmt` DECIMAL(65, 30) NULL,
    `collisionAmt` DECIMAL(65, 30) NULL,
    `dentAmt` DECIMAL(65, 30) NULL,
    `excessWearAmt` DECIMAL(65, 30) NULL,
    `ppfAmt` DECIMAL(65, 30) NULL,
    `wheelTireAmt` DECIMAL(65, 30) NULL,
    `moneyFlag` BOOLEAN NULL,
    `titlingFlag` BOOLEAN NULL,
    `mileageFlag` BOOLEAN NULL,
    `licenseInsuranceFlag` BOOLEAN NULL,
    `feesFlag` BOOLEAN NULL,
    `cleanFlag` BOOLEAN NULL,
    `payoffFlag` BOOLEAN NULL,
    `payoffSent` DATETIME(3) NULL,
    `atcFlag` BOOLEAN NULL,
    `registrationSent` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `fundingNotes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Deal` ADD CONSTRAINT `Deal_salespersonId_fkey` FOREIGN KEY (`salespersonId`) REFERENCES `Salesperson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deal` ADD CONSTRAINT `Deal_financeManagerId_fkey` FOREIGN KEY (`financeManagerId`) REFERENCES `FinanceManager`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
