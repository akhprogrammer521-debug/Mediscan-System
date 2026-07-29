/*
  Warnings:

  - A unique constraint covering the columns `[scope,role,key]` on the table `SystemSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SystemSetting_scope_role_key_key` ON `SystemSetting`(`scope`, `role`, `key`);
