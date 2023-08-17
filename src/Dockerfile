# syntax=docker/dockerfile:1

FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm start

CMD ["node", "start/server.js"]

EXPOSE 3000
