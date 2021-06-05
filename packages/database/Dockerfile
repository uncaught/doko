FROM mariadb:10.5.10-focal

ENV MYSQL_DATABASE=doko

COPY ./schema /docker-entrypoint-initdb.d

CMD [ "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci" ]