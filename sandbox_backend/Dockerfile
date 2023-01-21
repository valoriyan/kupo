FROM node:18.12.1

##################################################
# Install Redis
##################################################

RUN apt-get update
RUN apt-get install -y lsb-release

RUN curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

RUN echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list

RUN apt-get update
RUN apt-get install redis -y


##################################################
# Setup App
##################################################
WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .

RUN npx tsc

CMD ["/app/scripts/entrypoint.sh"]