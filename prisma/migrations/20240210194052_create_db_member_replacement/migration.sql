-- CreateTable
CREATE TABLE "member_replacement" (
    "id" UUID NOT NULL,
    "replacement_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "member_replacement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_replacement_id_key" ON "member_replacement"("id");

-- AddForeignKey
ALTER TABLE "member_replacement" ADD CONSTRAINT "member_replacement_replacement_id_fkey" FOREIGN KEY ("replacement_id") REFERENCES "training_replacement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_replacement" ADD CONSTRAINT "member_replacement_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
