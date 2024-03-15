/*
  Warnings:

  - You are about to drop the column `endDate` on the `member_plan` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `member_plan` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `member_plan` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `member_plan` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `plan` table. All the data in the column will be lost.
  - You are about to drop the column `modalitie` on the `plan` table. All the data in the column will be lost.
  - Added the required column `ends_at` to the `member_plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "member_plan" DROP COLUMN "endDate",
DROP COLUMN "isActive",
DROP COLUMN "price",
DROP COLUMN "startDate",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ends_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "starts_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "plan" DROP COLUMN "isActive",
DROP COLUMN "modalitie",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modality" "Modality" NOT NULL DEFAULT 'pilates',
ALTER COLUMN "training_amount" SET DEFAULT 4;
