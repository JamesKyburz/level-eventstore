FROM jameskyburz/node:8.9.1-alpine

MAINTAINER James Kyburz "james.kyburz@gmail.com"

ENV SERVE_USER guest
ENV SERVE_PASSWORD guest
ENV REACT_APP_BUILD /usr/src/app/src/ui/build
ENV LOG_LEVEL warn
ENV PORT 5000

RUN ./node_modules/.bin/serve-create-react-app

USER node

ENTRYPOINT ["node", "src/index"]
CMD []

EXPOSE 5000
