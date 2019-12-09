FROM jameskyburz/node:12.13.1-alpine-devtools as devtools

LABEL maintainer="James Kyburz james.kyburz@gmail.com"

WORKDIR /usr/src/app

ENV NPM_CONFIG_LOGLEVEL warn
ARG NODE_ENV=development
COPY package.json package-lock*.json npm-shrinkwrap*.json /usr/src/app/
RUN npm i

FROM node:12.13.1-alpine

WORKDIR /usr/src/app

COPY . .
COPY --from=devtools /usr/src/app/node_modules /usr/src/app/node_modules

ENV LOG_LEVEL warn

ENTRYPOINT ["node", "src/index"]
CMD []

EXPOSE 5000
