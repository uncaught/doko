FROM node:22.10.0-bookworm

ENV NODE_ENV=production
ENV LOGUX_HOST=0.0.0.0
ENV LOGUX_PORT=3000
ENV DB_NAME=doko
ENV DB_HOST=database
ENV DB_PORT=3306
ENV DB_USER=root

RUN mkdir -p /doko/packages/common /doko/packages/server

COPY ./common /doko/packages/common
COPY ./server /doko/packages/server

RUN cd /doko/packages/common && npm ci
RUN cd /doko/packages/server && npm ci

WORKDIR /doko/packages/server

ENTRYPOINT [ "npm", "run", "prod" ]