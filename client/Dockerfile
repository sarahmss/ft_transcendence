FROM node:16-alpine3.16

WORKDIR /srcs

COPY ./ ./

RUN npm install

EXPOSE $FRONT_PORT

ENTRYPOINT ["npm", "start"]
