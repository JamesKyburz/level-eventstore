FROM jameskyburz/node:8.0.0-alpine

MAINTAINER James Kyburz "james.kyburz@gmail.com"

ENV SERVE_USER guest
ENV SERVE_PASSWORD guest
ENV REACT_APP_BUILD /usr/src/app/src/ui/build

RUN ./node_modules/.bin/serve-create-react-app /usr/src/app/src/ui

USER node

EXPOSE 5000
