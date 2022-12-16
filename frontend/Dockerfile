FROM node:18.12.1

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .

RUN API_BASE_URL=$API_BASE_URL yarn build

CMD [ "yarn", "start" ]
