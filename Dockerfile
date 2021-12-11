FROM node:14.17.3

WORKDIR /app

COPY package.json package.json
RUN yarn --ignore-scripts install

COPY . .

RUN echo $( ls )

RUN npx tsoa spec-and-routes
# RUN npx tsc


# CMD [ "npm", "run", "dev" ]
