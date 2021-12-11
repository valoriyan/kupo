FROM node:14.17.3

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --ignore-scripts install

COPY . .


# CMD [ "npm", "run", "dev" ]
