FROM node:14.17.3

WORKDIR /app

COPY package.json package.json
RUN yarn install

COPY . .

RUN yarn build


CMD [ "npm", "run", "dev" ]
