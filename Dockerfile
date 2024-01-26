FROM node:20.5.1

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

ENV NODE_ENV="dev"

EXPOSE 80

CMD npm start && docker run -it -e NGROK_AUTHTOKEN=2bNO8reJbSGWT6Wm6LyJ1W7dsfW_8rLLpHa94xbaVn3VCs3M ngrok/ngrok tunnel --label edge=edghts_2bNUtLXX3daB9zhYTzb4OmQBo6L http://localhost:80