FROM node:20.12.2-bookworm as build
ARG vers

RUN mkdir -p /doko/packages/common /doko/packages/client

COPY ./common /doko/packages/common
COPY ./client /doko/packages/client

RUN cd /doko/packages/common && npm ci
RUN cd /doko/packages/client && npm ci && npm run build && ./writeVersion.sh $vers

FROM httpd:2.4.59-alpine3.19

COPY ./client/httpd.conf /usr/local/apache2/conf/httpd.conf

RUN rm -rf /usr/local/apache2/htdocs

COPY --from=build /doko/packages/client/build /usr/local/apache2/htdocs
