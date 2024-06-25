/*
  Warnings:

  - Added the required column `plan_id` to the `training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "member_plan" ADD COLUMN     "trainingId" UUID;

-- AlterTable
ALTER TABLE "training" ADD COLUMN     "plan_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_plan" ADD CONSTRAINT "member_plan_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "training"("id") ON DELETE SET NULL ON UPDATE CASCADE;
