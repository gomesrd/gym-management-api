/*
  Warnings:

  - The values [peding] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('realized', 'foul', 'pending', 'scheduled');
ALTER TABLE "training_replacement" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "training_record" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "training_record" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "training_replacement" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "training_replacement" ALTER COLUMN "status" SET DEFAULT 'scheduled';
ALTER TABLE "training_record" ALTER COLUMN "status" SET DEFAULT 'realized';
COMMIT;
