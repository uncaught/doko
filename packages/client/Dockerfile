FROM node:22.10.0-bookworm as build
ARG vers

RUN mkdir -p /doko/packages/common /doko/packages/client

COPY ./common /doko/packages/common
COPY ./client /doko/packages/client

RUN cd /doko/packages/common && npm ci
RUN cd /doko/packages/client && npm ci && npm run build && ./writeVersion.sh $vers

FROM httpd:2.4.62-alpine3.20

COPY ./client/httpd.conf /usr/local/apache2/conf/httpd.conf

RUN rm -rf /usr/local/apache2/htdocs

COPY --from=build /doko/packages/client/build /usr/local/apache2/htdocs
