### Development Stack
- Start the proxy in background: `docker-compose up -d proxy`. This routes the websocket `/ws`-path to the server and everything else to the client.
- Start the database in background: `docker-compose up -d database`. 
  - If the database is not initialized, all files in `packages/database/schema` are executed.
  - To fully delete the database, stop everything with `docker-compose down` and delete the `mysql` folder.
- Install dependencies: `./yarn.sh install`
- Best start server and client in separate tabs in foreground to see their output:
  - Server: `docker-compose up server`
  - Client: `docker-compose up client`
- Browse to https://localhost (SSL is required for using the camera)

### Reset database
```bash
cat xxx.sql.gz | gunzip | docker-compose exec -T database mysql doko
docker-compose restart server
```

### Nomenklatur
- Eine **Runde** (round) ist ein abgeschlossener Satz an Spielen, z.B. regulär 24 Spiele oder alle Spiele eines Abends.
- Ein **Durchgang** (run) sind alle Spiele bis der startende Geber wieder an der Reihe wäre. In der Regel sind das 4 
Spiele, kann aber durch Pflichtsoli länger werden. Die Dauer von Bockspielen entspricht normalerweilse einem Durchgang.
- Ein **Spiel** (game) ist ein normaler Spieldurchgang mit 10/12 Stichen (ohne/mit Neuen). 
- Ein **Stich** (trick) ist ein Teil eines Spiels bei dem 4 Karten gespielt wurden.

### Deploy
- Run `./publish.sh 0.0.0` with a proper version
- This will push all three images (client, db, server) to docker hub
- Push the created tag `git push --follow-tags`
- On the server, update the version for the images and then:

```bash
./backup.sh
docker-compose up -d
```
