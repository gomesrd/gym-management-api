# api-gym-management
This is the backend in the API standard for a gym management system

export NODE_ENV=

nvm use $(cat .nvmrc)

docker-compose up --build

npx prisma migrate dev --name <name>

npx prisma migrate deploy
