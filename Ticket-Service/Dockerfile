FROM node:14.18.3-alpine

WORKDIR /app
ENV PORT=4001

COPY package.json yarn.lock .
RUN yarn install --production
COPY . .

EXPOSE ${PORT}

CMD [ "yarn","start" ]