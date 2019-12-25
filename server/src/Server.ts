import {Server} from '@logux/server';

const server = new Server(Server.loadOptions(process, {
  subprotocol: '1.0.0',
  supports: '1.x',
  root: __dirname,
}));

export default server;
