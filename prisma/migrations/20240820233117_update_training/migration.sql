/*
  Warnings:

  - You are about to drop the column `plan_id` on the `training` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "training" DROP CONSTRAINT "training_plan_id_fkey";

-- AlterTable
ALTER TABLE "training" DROP COLUMN "plan_id";
