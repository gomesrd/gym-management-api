/*
  Warnings:

  - A unique constraint covering the columns `[member_id,plan_id]` on the table `member_plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "member_plan_member_id_plan_id_key" ON "member_plan"("member_id", "plan_id");
