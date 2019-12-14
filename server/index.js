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

const initGruops = [
  {
    id: 'A001',
    name: 'A001',
  },
];

server.channel('groups/all', {
  async access(ctx, action, meta) {
    return true;
  },
  async init(ctx, action, meta) {
    ctx.sendBack({type: 'groups/all', groups: initGruops});
  },
});

server.type('groups/add', {
  async access(ctx, action, meta) {
    return true;
  },
  resend(ctx, action, meta) {
    return {channel: 'groups/all'};
  },
  async process(ctx, action, meta) {
    await initGruops.push(action.group);
  },
});

server.listen();
