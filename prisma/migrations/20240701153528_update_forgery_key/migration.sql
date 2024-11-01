-- DropForeignKey
ALTER TABLE "member_plan" DROP CONSTRAINT "member_plan_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member_replacement" DROP CONSTRAINT "member_replacement_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member_training" DROP CONSTRAINT "member_training_member_id_fkey";

-- DropForeignKey
ALTER TABLE "training" DROP CONSTRAINT "training_personal_trainer_id_fkey";

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_personal_trainer_id_fkey" FOREIGN KEY ("personal_trainer_id") REFERENCES "personal_trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_training" ADD CONSTRAINT "member_training_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_replacement" ADD CONSTRAINT "member_replacement_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_plan" ADD CONSTRAINT "member_plan_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
