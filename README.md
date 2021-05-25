### Development Stack
- Start the proxy in background: `docker-compose up -d proxy`. This routes the websocket `/ws`-path to the server and everything else to the client.
- Start the database in background: `docker-compose up -d database`. This will initialize the db with everything in `packages/server/src/database/schema` if the volume is newly created. To fully delete the database, use `docker-compose down --volumes`.
- Install dependencies: `./yarn.sh install`
- Best start server and client in separate tabs in foreground to see their output:
  - Server: `docker-compose up server`
  - Client: `docker-compose up client`
- Browse to https://localhost (SSL is required for using the camera)
  - Until create-react-app 3.3.1 is not released, hack in [this fix for wss](https://github.com/facebook/create-react-app/pull/8079/commits/9585c26593e18296fe202bfea198130f9d0dbd34)


### Reset database
```bash
docker-compose stop -t 0 server
docker-compose rm -f server
cat xxx.sql.gz | gunzip | docker-compose exec -T database mysql doko
docker-compose up server
```

### Nomenklatur
- Eine **Runde** (round) ist ein abgeschlossener Satz an Spielen, z.B. regulär 24 Spiele oder alle Spiele eines Abends.
- Ein **Durchgang** (run) sind alle Spiele bis der startende Geber wieder an der Reihe wäre. In der Regel sind das 4 
Spiele, kann aber durch Pflichtsoli länger werden. Die Dauer von Bockspielen entspricht normalerweilse einem Durchgang.
- Ein **Spiel** (game) ist ein normaler Spieldurchgang mit 10/12 Stichen (ohne/mit Neuen). 
- Ein **Stich** (trick) ist ein Teil eines Spiels bei dem 4 Karten gespielt wurden.

### Deploy
Proper deploy process is still missing! This is more a hacky manual install/deploy 
because the client build is done server-side.

- Create release tag on github and copy link to release archive (`tar.gz`)
- SSH into server and:

```bash
cd /var/www/doko
wget https://github.com/uncaught/doko/archive/v1.3.0.tar.gz
tar xf v1.3.0.tar.gz
cd doko-1.3.0
./build.sh
cd ..
./backup.sh
docker-compose down
ln -sfn doko-1.3.0 doko
docker-compose up -d
```
