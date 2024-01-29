-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('pilates', 'functional');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('plan', 'singular', 'replacement');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('realized', 'foul');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'employee', 'member');

-- CreateEnum
CREATE TYPE "Occupation" AS ENUM ('physical_educator', 'physiotherapist');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('monthly', 'quarterly', 'semiannual', 'annual');

-- CreateEnum
CREATE TYPE "MemberAmount" AS ENUM ('singular', 'pair');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'member',
    "birth_date" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_address" (
    "id" UUID NOT NULL,
    "address" VARCHAR NOT NULL,
    "address_number" VARCHAR NOT NULL,
    "address_complement" VARCHAR,
    "address_neighborhood" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "state" VARCHAR NOT NULL,
    "country" VARCHAR DEFAULT 'Brazil',
    "zip_code" VARCHAR NOT NULL,
    "user_address_id" UUID NOT NULL,

    CONSTRAINT "users_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_trainer" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "occupation" "Occupation" NOT NULL DEFAULT 'physical_educator',

    CONSTRAINT "personal_trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training" (
    "id" UUID NOT NULL,
    "fixed_day" "Days",
    "single_date" VARCHAR,
    "start_time" VARCHAR,
    "end_time" VARCHAR,
    "modality" "Modality" NOT NULL DEFAULT 'pilates',
    "type" "TrainingType" NOT NULL DEFAULT 'plan',
    "deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" UUID NOT NULL,
    "personal_trainer_id" UUID NOT NULL,
    "training_replacement_id" UUID,

    CONSTRAINT "training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_record" (
    "id" UUID NOT NULL,
    "type" "TrainingType" NOT NULL DEFAULT 'plan',
    "status" "Status" NOT NULL DEFAULT 'realized',
    "training_id" UUID NOT NULL,
    "personal_trainer_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_replacement" (
    "id" UUID NOT NULL,
    "realized" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "training_replacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "modalitie" "Modality" NOT NULL DEFAULT 'pilates',
    "recurrence" "Recurrence" NOT NULL DEFAULT 'quarterly',
    "member_amount" "MemberAmount" NOT NULL DEFAULT 'singular',
    "training_amount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_plan" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION NOT NULL,
    "plan_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_address_id_key" ON "users_address"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_address_user_address_id_key" ON "users_address"("user_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_trainer_id_key" ON "personal_trainer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_trainer_user_id_key" ON "personal_trainer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_id_key" ON "member"("id");

-- CreateIndex
CREATE UNIQUE INDEX "member_user_id_key" ON "member"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_id_key" ON "training"("id");

-- CreateIndex
CREATE UNIQUE INDEX "training_training_replacement_id_key" ON "training"("training_replacement_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_start_time_end_time_fixed_day_personal_trainer_id_key" ON "training"("start_time", "end_time", "fixed_day", "personal_trainer_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_start_time_end_time_single_date_personal_trainer_i_key" ON "training"("start_time", "end_time", "single_date", "personal_trainer_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_record_id_key" ON "training_record"("id");

-- CreateIndex
CREATE UNIQUE INDEX "training_replacement_id_key" ON "training_replacement"("id");

-- CreateIndex
CREATE UNIQUE INDEX "plan_id_key" ON "plan"("id");

-- AddForeignKey
ALTER TABLE "users_address" ADD CONSTRAINT "users_address_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_trainer" ADD CONSTRAINT "personal_trainer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_training_replacement_id_fkey" FOREIGN KEY ("training_replacement_id") REFERENCES "training_replacement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_personal_trainer_id_fkey" FOREIGN KEY ("personal_trainer_id") REFERENCES "personal_trainer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_personal_trainer_id_fkey" FOREIGN KEY ("personal_trainer_id") REFERENCES "personal_trainer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_replacement" ADD CONSTRAINT "training_replacement_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_plan" ADD CONSTRAINT "member_plan_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_plan" ADD CONSTRAINT "member_plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
