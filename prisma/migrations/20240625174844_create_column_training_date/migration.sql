/*
  Warnings:

  - You are about to drop the column `regular_training` on the `training` table. All the data in the column will be lost.
  - You are about to drop the column `singular_training` on the `training` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[starts_at,ends_at,training_date,personal_trainer_id]` on the table `training` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `training_date` to the `training` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "training_starts_at_ends_at_regular_training_personal_traine_key";

-- DropIndex
DROP INDEX "training_starts_at_ends_at_singular_training_personal_train_key";

-- AlterTable
ALTER TABLE "training" DROP COLUMN "regular_training",
DROP COLUMN "singular_training",
ADD COLUMN     "training_date" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "training_starts_at_ends_at_training_date_personal_trainer_i_key" ON "training"("starts_at", "ends_at", "training_date", "personal_trainer_id");
