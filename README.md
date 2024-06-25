# api-gym-management

This is the backend in the API standard for a gym management system

export NODE_ENV=

nvm use $(cat .nvmrc)

docker-compose up --build

npx prisma migrate dev --name <name> - run a migration in dev

npx prisma migrate deploy - run a migration in prod
