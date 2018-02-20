FROM jameskyburz/node:8.9.4-alpine as react

LABEL maintainer="James Kyburz james.kyburz@gmail.com"

ENV SERVE_USER guest
ENV SERVE_PASSWORD guest
ENV REACT_APP_BUILD /usr/src/app/src/ui/build
ENV LOG_LEVEL warn
ENV PORT 5000

RUN ./node_modules/.bin/serve-create-react-app

FROM node:8.9.4-alpine

WORKDIR /usr/src/app

COPY package.json package-lock*.json /usr/src/app/

COPY --from=react /usr/src/app/src/ui/src /usr/src/app/src/ui/src
COPY --from=react /usr/src/app/src/ui/build /usr/src/app/src/ui/build
COPY --from=react /usr/src/app/src/ui/package* /usr/src/app/src/ui/

RUN \
  rm -rf node_modules && \
  npm install --production && \
  cd src/ui && \
  rm -rf node_modules && \
  npm install --production

COPY . /usr/src/app

USER node

ENTRYPOINT ["node", "src/index"]
CMD []

EXPOSE 5000
