FROM node:22 AS builder

WORKDIR /vault

COPY . .

RUN npm i && npm run build

CMD [ "node","dist/index.js" ]
