/*
  Warnings:

  - You are about to drop the column `training_id` on the `training_replacement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "training_replacement" DROP CONSTRAINT "training_replacement_training_id_fkey";

-- AlterTable
ALTER TABLE "training" ADD COLUMN     "training_replacement_id" UUID;

-- AlterTable
ALTER TABLE "training_replacement" DROP COLUMN "training_id";

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_training_replacement_id_fkey" FOREIGN KEY ("training_replacement_id") REFERENCES "training_replacement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
