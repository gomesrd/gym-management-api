-- CreateTable
CREATE TABLE "personal_trainer" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "cpf" VARCHAR NOT NULL,
    "occupation" VARCHAR NOT NULL DEFAULT 'Personal Trainer',
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "role" VARCHAR DEFAULT 'personal_trainer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "birth_date" VARCHAR,
    "email" VARCHAR,
    "phone" VARCHAR,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training" (
    "id" UUID NOT NULL,
    "fixed_day" VARCHAR,
    "single_date" VARCHAR,
    "start_time" VARCHAR NOT NULL,
    "modality_training" VARCHAR NOT NULL DEFAULT 'Pilates',
    "type_training" VARCHAR NOT NULL DEFAULT 'Plan',
    "personal_trainer_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_record" (
    "id" UUID NOT NULL,
    "type_training" VARCHAR NOT NULL,
    "status_training" VARCHAR NOT NULL,
    "training_id" UUID NOT NULL,
    "personal_trainer_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personal_trainer_cpf_key" ON "personal_trainer"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "personal_trainer_email_key" ON "personal_trainer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "member_email_key" ON "member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "training_start_time_fixed_day_personal_trainer_id_key" ON "training"("start_time", "fixed_day", "personal_trainer_id");

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_personal_trainer_id_fkey" FOREIGN KEY ("personal_trainer_id") REFERENCES "personal_trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_personal_trainer_id_fkey" FOREIGN KEY ("personal_trainer_id") REFERENCES "personal_trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_record" ADD CONSTRAINT "training_record_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
