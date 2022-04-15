FROM node:14.19.1-alpine

WORKDIR /app
ENV PORT=4004

COPY package.json yarn.lock .
RUN yarn install --production
COPY . .

EXPOSE ${PORT}

CMD [ "yarn","start" ]