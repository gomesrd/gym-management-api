/*
  Warnings:

  - You are about to drop the column `training_replacement_id` on the `training` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `training_replacement` table. All the data in the column will be lost.
  - Added the required column `training_id` to the `training_replacement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "training" DROP CONSTRAINT "training_training_replacement_id_fkey";

-- DropForeignKey
ALTER TABLE "training_replacement" DROP CONSTRAINT "training_replacement_member_id_fkey";

-- DropIndex
DROP INDEX "training_training_replacement_id_key";

-- AlterTable
ALTER TABLE "training" DROP COLUMN "training_replacement_id";

-- AlterTable
ALTER TABLE "training_replacement" DROP COLUMN "member_id",
ADD COLUMN     "training_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "training_replacement" ADD CONSTRAINT "training_replacement_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
