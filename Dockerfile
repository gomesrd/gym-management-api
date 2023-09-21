FROM node:19-alpine

WORKDIR /app

COPY package*.json ./

#RUN apk update \
#  && apk add curl

COPY . .

RUN npm install

RUN npm run build

ENV NODE_ENV="dev"

EXPOSE 8080

CMD ["npm", "start"]

