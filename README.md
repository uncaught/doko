### Dev
- Have docker and docker-compose installed 
- Install dependencies with:
```bash
./yarn.sh common install
./yarn.sh client install
./yarn.sh server install
```
- Start with `docker-compose up -d`
- Open http://127.0.0.1:3333
- Stop with `docker-compse down` 
- To delete the database, too, use `docker-compose down --volumes`

### Reset database
```bash
docker-compose down --volumes
# Comment-out MYSQL_PWD in docker-compose.yml 
docker-compose up -d database
# Comment-in MYSQL_PWD in docker-compose.yml 
docker-compose down
docker-compose up -d database
cat xxx.sql.gz | gunzip | docker-compose exec -T database mysql doko
docker-compose up server
```

##### SSL
- HTTPS is required for using the browser's camera
- Use an SSL-proxy like nginx, routing `/` to port 3333 and `/api` to port 3030
- Until create-react-app 3.3.1 is not released, hack in [this fix for wss](https://github.com/facebook/create-react-app/pull/8079/commits/9585c26593e18296fe202bfea198130f9d0dbd34)


### Nomenklatur
- Eine **Runde** (round) ist ein abgeschlossener Satz an Spielen, z.B. regulär 24 Spiele oder alle Spiele eines Abends.
- Ein **Durchgang** (run) sind alle Spiele bis der startende Geber wieder an der Reihe wäre. In der Regel sind das 4 
Spiele, kann aber durch Pflichtsoli länger werden. Die Dauer von Bockspielen entspricht normalerweilse einem Durchgang.
- Ein **Spiel** (game) ist ein normaler Spieldurchgang mit 10/12 Stichen (ohne/mit Neuen). 
- Ein **Stich** (trick) ist ein Teil eines Spiels bei dem 4 Karten gespielt wurden.
