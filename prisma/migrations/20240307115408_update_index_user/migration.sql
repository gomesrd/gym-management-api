-- DropIndex
DROP INDEX "cpf_name_index";

-- CreateIndex
CREATE INDEX "cpf_name_email_index" ON "users"("cpf", "name", "email");
