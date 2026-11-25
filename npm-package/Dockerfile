FROM node:26-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]