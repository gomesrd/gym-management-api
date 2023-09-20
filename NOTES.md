## dependencies

yarn add @prisma/client fastify fastify-zod zod zod-to-json-schema fastify-jwt fastify-swagger

## devDependencies

yarn add ts-node-dev typescript @types/node --dev

## Initialise prisma

npx prisma init --datasource-provider postgresql

### Migrate the schema

npx prisma migrate dev --name init

### PERSONAL TRAINER

GET ALL - Only admin
GET UNIQUE - Personal owner
CREATE - Only admin
UPDATE - admin and personal owner
DELETE - Only admin

Two rules needed

1. Verify if the user is admin
2. Verify if the user is personal trainer and is the owner a personal trainer

### MEMBER

GET ALL - Only admin and personal trainer
GET UNIQUE - Member owner
CREATE - Everyone
UPDATE - Admin and member owner
DELETE - Admin and member owner

Three rules needed

1. Verify if the user is admin
2. Verify if the user is personal trainer
3. Verify if the user is member and is the owner a member

### TRAINING

GET ALL - Only admin
GET ALL BY PERSONAL TRAINER - Personal owner
GET ALL BY MEMBER - Member owner
GET UNIQUE - Admin, personal owner and member owner
CREATE - Admin and personal trainer
UPDATE - Admin and personal trainer
DELETE - Admin and personal trainer

Three rules needed

1. Verify if the user is admin
2. Verify if the user is personal trainer and is the owner a personal trainer
3. Verify if the user is member and is the owner of the member

### TRAINING RECORD

****
GET ALL - Only admin
GET UNIQUE - Personal owner and member owner
CREATE - Personal trainer
UPDATE - Only admin
DELETE - Only admin

Three rules needed

1. Verify if the user is admin
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



## TODO
Criar end point para "deletar" o member, alterando o status para inativo
Criar end point para "deletar" o personal trainer, alterando o status para inativo
Criar end point para "deletar" o training, alterando o status para inativo