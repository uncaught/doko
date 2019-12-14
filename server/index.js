const {Server} = require('@logux/server');
const jwt = require('jsonwebtoken');

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname,
  }),
);

server.auth(async (userId, credentials) => {
  return true;
  //const data = await jwt.verify(credentials, process.env.JWT_SECRET);
  //return data.sub === userId;
});

server.listen();
