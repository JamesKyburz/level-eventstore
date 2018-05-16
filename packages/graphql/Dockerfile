FROM jameskyburz/node:8.11.0-alpine

LABEL maintainer="James Kyburz james.kyburz@gmail.com"

ENV LOG_LEVEL warn
ENV EVENTSTORE_HTTP_URL http://guest:guest@.localhost:5000
ENV EVENTSTORE_WS_URL ws://guest:guest@.localhost:5000

ENTRYPOINT ["node", "src/index"]
CMD []

EXPOSE 5000
