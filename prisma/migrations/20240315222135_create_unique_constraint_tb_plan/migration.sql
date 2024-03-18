/*
  Warnings:

  - A unique constraint covering the columns `[name,modality,recurrence,member_amount,training_amount]` on the table `plan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "description" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "plan_name_modality_recurrence_member_amount_training_amount_key" ON "plan"("name", "modality", "recurrence", "member_amount", "training_amount");
