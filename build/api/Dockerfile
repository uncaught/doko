FROM node:13.5.0-alpine3.10

RUN mkdir -p /doko/server

COPY ./server/node_modules /doko/server/node_modules
COPY ./server/build/node_modules /doko/server/build/node_modules
COPY ./server/build/src /doko/server/build/src

WORKDIR /doko/server/build/src

EXPOSE 80

ENV NODE_ENV production
ENV LOGUX_HOST 0.0.0.0
ENV LOGUX_PORT 80

ENTRYPOINT ["node", "index.js"]
