FROM jameskyburz/node:12.14.0-alpine3.11-devtools as devtools

LABEL maintainer="James Kyburz james.kyburz@gmail.com"

WORKDIR /usr/src/app

ENV NPM_CONFIG_LOGLEVEL warn
COPY package.json .
COPY package-lock.json .
RUN npm install --production

FROM node:12.14.0-alpine3.11

WORKDIR /usr/src/app

COPY . .
COPY --from=devtools /usr/src/app/node_modules /usr/src/app/node_modules

ENV LOG_LEVEL warn
ENV EVENTSTORE_HTTP_URL http://guest:guest@.localhost:5000
ENV EVENTSTORE_WS_URL ws://guest:guest@.localhost:5000

ENTRYPOINT ["node", "src/index"]
CMD []

EXPOSE 5000
