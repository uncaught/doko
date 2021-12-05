FROM node:16.13.1-alpine3.14

ENV NODE_ENV=production
ENV LOGUX_HOST=0.0.0.0
ENV LOGUX_PORT=80
ENV DB_NAME=doko
ENV DB_HOST=database
ENV DB_PORT=3306
ENV DB_USER=root

EXPOSE 80

RUN mkdir /server

COPY ./build /server

WORKDIR /server

ENTRYPOINT [ "node", "server.js" ]