FROM node:14.17.3

WORKDIR /app

COPY package.json package.json
RUN yarn install

COPY . .

# RUN npx tsoa spec-and-routes
RUN npx tsc


CMD [ "npm", "run", "dev" ]
