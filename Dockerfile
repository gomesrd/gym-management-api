FROM node:20.5.1

WORKDIR /app

COPY package*.json ./

COPY . .

COPY .env .env

RUN npm install

RUN npm run build

ENV NODE_ENV="docker"

EXPOSE 80

CMD npm run migrate && npm start
