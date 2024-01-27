FROM node:20.5.1

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

ENV NODE_ENV="dev"

EXPOSE 80

CMD npm start