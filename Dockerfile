FROM node:14.17.3

WORKDIR /app

COPY package.json package.json
RUN yarn --ignore-scripts install

COPY . .

RUN npx tsoa spec-and-routes
RUN npx tsc


# CMD node build/src/server.js -p $PORT
# CMD ["yarn" "run" "dev" "-p $PORT"]
# CMD [ "npm", "run", "dev" ]
