FROM node:20

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $FRONT_PORT

ENTRYPOINT ["npm", "start"]
