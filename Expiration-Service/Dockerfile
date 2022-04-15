FROM node:14.19.1-alpine

WORKDIR /app

COPY package.json .
RUN yarn install --production
COPY . .

CMD [ "yarn","start" ]