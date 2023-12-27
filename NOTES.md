## dependencies

yarn add @prisma/client fastify fastify-zod zod zod-to-json-schema fastify-jwt fastify-swagger

## devDependencies

yarn add ts-node-dev typescript @types/node --dev

## Initialise prisma

npx prisma init --datasource-provider postgresql

### Migrate the schema

npx prisma migrate dev --name init

### PERSONAL TRAINER

GET ALL - Only Admin
GET UNIQUE - Personal owner
CREATE - Only Admin
UPDATE - Admin and personal owner
DELETE - Only Admin

Two rules needed

1. Verify if the user is Admin
2. Verify if the user is personal trainer and is the owner a personal trainer

### MEMBER

GET ALL - Only Admin and personal trainer
GET UNIQUE - Member owner
CREATE - Everyone
UPDATE - Admin and member owner
DELETE - Admin and member owner

Three rules needed

1. Verify if the user is Admin
2. Verify if the user is personal trainer
3. Verify if the user is member and is the owner a member

### TRAINING

GET ALL - Only Admin
GET ALL BY PERSONAL TRAINER - Personal owner
GET ALL BY MEMBER - Member owner
GET UNIQUE - Admin, personal owner and member owner
CREATE - Admin and personal trainer
UPDATE - Admin and personal trainer
DELETE - Admin and personal trainer

Three rules needed

1. Verify if the user is Admin
2. Verify if the user is personal trainer and is the owner a personal trainer
3. Verify if the user is member and is the owner of the member

### TRAINING RECORD

****
GET ALL - Only Admin
GET UNIQUE - Personal owner and member owner
CREATE - Personal trainer
UPDATE - Only Admin
DELETE - Only Admin

Three rules needed

1. Verify if the user is Admin
2. Verify if the user is personal trainer, if is the owner a personal trainer and if is the owner a
   training_id
3. Verify if the user is member, if the owner of the member and if is the owner a member_id

### FEATURES

*Notifications*
*Community*
*Chat*
*Payment*
*Calendar*
*Dashboard*
*Finance*
*Reports*
*Analytics*
*Marketing*
*Mailing*
*SMS*
*Push Notifications*
*Blog*


Sunday - Domingo
Monday - Segunda-feira
Tuesday - Terça-feira
Wednesday - Quarta-feira
Thursday - Quinta-feira
Friday - Sexta-feira
Saturday - Sábado

// TODO - Implementar integração com cognito ou firebase
// TODO - Criar paginação
// TODO - Criar validação para cpf
// TODO - Criar validação para cadastro de usuários
// TODO - Criar endpoints Planos
// TODO - Incluir nos arquivos route os parametros aceitos em cada endpoint (busca por id, name, cpf, etc)
// TODO - Organizar toda a estrutura dos schemas (schemas genêricos)
// TODO - Validar se o personal trainer não está criando um registro de treino como membro
// TODO - Validar se o treino no registro de treino pertence ao member e ao personal trainer
// TODO - Criar possibilidade de transferência de treino para outro personal trainer
// TODO - Adicionar validação para verificar se o registro do treino está sendo salvo para o member correto
// TODO - Criar endpoint para buscar as informações de training-replacement (getAll, getById)
// TODO - Criar regra de negócio para verificar se o número de aulas do mês ultrapassa a quantidade de aula que o aluno tem direito
// TODO - Adicionar o nome dos query path (id --> personal_traine_id, member_id, etc)
// TODO - Criar método para reset de senha (apenas se não integrar com o firebase)