/*
  Warnings:

  - You are about to drop the column `realized` on the `training_replacement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "training_replacement" DROP COLUMN "realized",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'realized';
