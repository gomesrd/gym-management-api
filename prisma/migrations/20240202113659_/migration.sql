/*
  Warnings:

  - You are about to drop the column `fixed_day` on the `training` table. All the data in the column will be lost.
  - You are about to drop the column `single_date` on the `training` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[start_time,end_time,regular_training,personal_trainer_id]` on the table `training` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[start_time,end_time,singular_training,personal_trainer_id]` on the table `training` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "training_start_time_end_time_fixed_day_personal_trainer_id_key";

-- DropIndex
DROP INDEX "training_start_time_end_time_single_date_personal_trainer_i_key";

-- AlterTable
ALTER TABLE "training" DROP COLUMN "fixed_day",
DROP COLUMN "single_date",
ADD COLUMN     "regular_training" "Days",
ADD COLUMN     "singular_training" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "training_start_time_end_time_regular_training_personal_trai_key" ON "training"("start_time", "end_time", "regular_training", "personal_trainer_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_start_time_end_time_singular_training_personal_tra_key" ON "training"("start_time", "end_time", "singular_training", "personal_trainer_id");
