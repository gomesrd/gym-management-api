/*
  Warnings:

  - You are about to drop the `member_training` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "member_training" DROP CONSTRAINT "member_training_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member_training" DROP CONSTRAINT "member_training_training_id_fkey";

-- AlterTable
ALTER TABLE "training" ADD COLUMN     "member_id" TEXT[];

-- DropTable
DROP TABLE "member_training";

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
