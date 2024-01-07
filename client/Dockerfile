FROM node:16-alpine3.16

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $FRONT_PORT

ENTRYPOINT ["npm", "start"]
