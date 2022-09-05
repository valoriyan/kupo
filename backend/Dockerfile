FROM node:14.17.3

WORKDIR /app

COPY package.json package.json

# https://github.com/lovell/sharp/issues/3166
RUN npm install --platform=linux --arch=x64 sharp


RUN yarn install --ignore-scripts --production

COPY . .

RUN npx tsoa spec-and-routes
RUN npx tsc

CMD node build/src/server.js -p $PORT
