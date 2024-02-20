# Base image
FROM node:20

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE $BACK_PORT

CMD ["npm", "run", "start:prod"]
