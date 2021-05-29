ARG NODE_IMAGE
FROM ${NODE_IMAGE}

ENV NODE_ENV=production
ENV LOGUX_HOST=0.0.0.0
ENV LOGUX_PORT=80

EXPOSE 80

RUN mkdir /server

COPY ./build /server

WORKDIR /server

ENTRYPOINT [ "node", "index.js" ]