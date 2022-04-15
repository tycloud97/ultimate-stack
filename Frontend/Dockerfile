FROM node:14.19.1-alpine

WORKDIR /app

COPY package.json yarn.lock .

RUN yarn install

COPY . .

# RUN yarn build 

EXPOSE 3001

CMD ["yarn","dev"]