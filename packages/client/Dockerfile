FROM httpd:2.4.48-alpine

COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf

RUN rm -rf /usr/local/apache2/htdocs

COPY ./build /usr/local/apache2/htdocs
