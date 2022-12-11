FROM node:18.12.1

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