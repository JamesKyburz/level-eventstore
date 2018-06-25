FROM jameskyburz/node:8.11.3-alpine as react

LABEL maintainer="James Kyburz james.kyburz@gmail.com"

ENV REACT_APP_BUILD /usr/src/app/src/ui/build
ENV LOG_LEVEL warn

RUN npm install npm@latest -g

RUN cd /usr/src/app/src/ui && \
  npm ci && \
  npm run build

FROM node:8.11.3-alpine

RUN npm install npm@latest -g

WORKDIR /usr/src/app

COPY package.json package-lock*.json /usr/src/app/

COPY --from=react /usr/src/app/src/ui/src /usr/src/app/src/ui/src
COPY --from=react /usr/src/app/src/ui/build /usr/src/app/src/ui/build
COPY --from=react /usr/src/app/src/ui/package* /usr/src/app/src/ui/

RUN \
  rm -rf node_modules && \
  npm ci --production && \
  cd src/ui && \
  rm -rf node_modules && \
  npm ci --production

COPY . /usr/src/app

ENV SERVE_USER guest
ENV SERVE_PASSWORD guest
ENV PORT 5000
ENV REACT_APP_BUILD /usr/src/app/src/ui/build

USER node

ENTRYPOINT ["node", "src/index"]
CMD []

EXPOSE 5000
