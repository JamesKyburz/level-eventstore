FROM jameskyburz/node:12.18.2-alpine3.12-devtools as devtools

LABEL maintainer="James Kyburz james.kyburz@gmail.com"

WORKDIR /usr/src/app

ENV NPM_CONFIG_LOGLEVEL warn
COPY package.json .
COPY package-lock.json .
RUN npm install --production

FROM node:12.18.2-alpine3.12

WORKDIR /usr/src/app

COPY . .
COPY --from=devtools /usr/src/app/node_modules /usr/src/app/node_modules

ENV LOG_LEVEL warn

ENTRYPOINT ["node", "src/index"]
CMD []

EXPOSE 5000
