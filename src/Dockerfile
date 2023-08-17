# syntax=docker/dockerfile:1

FROM node:17

WORKDIR ./

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]

EXPOSE 3000
