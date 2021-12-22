FROM node:14.17.3

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .


RUN API_BASE_URL="https://api.kupono.io" yarn build

CMD [ "npm", "run", "start" ]
