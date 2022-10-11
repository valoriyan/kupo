FROM node:14.17.3

##################################################
# Setup App
##################################################
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .

RUN npx tsoa spec-and-routes
RUN npx tsc

CMD ["/app/scripts/entrypoint.sh"]