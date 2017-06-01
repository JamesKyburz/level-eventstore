FROM jameskyburz/node:8.0.0-alpine

MAINTAINER James Kyburz "james.kyburz@gmail.com"

ENV SERVE_USER guest
ENV SERVE_PASSWORD guest

RUN cd /usr/src/app/src/ui && npm install && npm run build

USER node

EXPOSE 5000
