FROM node:18.20.2-bookworm

ENV NODE_ENV=production
ENV LOGUX_HOST=0.0.0.0
ENV LOGUX_PORT=80
ENV DB_NAME=doko
ENV DB_HOST=database
ENV DB_PORT=3306
ENV DB_USER=root

EXPOSE 80

RUN mkdir /server

COPY ./common /common
COPY ./server /server

WORKDIR /server

RUN npm install --frozen-lockfile

ENTRYPOINT [ "npm", "run", "prod" ]