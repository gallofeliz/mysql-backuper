FROM node:lts-alpine

RUN apk add --no-cache mysql-client

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm i

ADD index.js ./

CMD ["node", "--no-warnings", "."]