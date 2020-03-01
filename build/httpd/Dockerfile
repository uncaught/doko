FROM httpd:2.4-alpine

COPY ./build/httpd/httpd.conf /usr/local/apache2/conf/httpd.conf

RUN rm -rf /usr/local/apache2/htdocs

COPY ./client/build /usr/local/apache2/htdocs
