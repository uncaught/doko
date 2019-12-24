import {Server} from '@logux/server';
import {GroupsAdd, GroupsAll, GroupsLoad} from '@doko/common';

const options = Server.loadOptions(process, {
  subprotocol: '1.0.0',
  supports: '1.x',
  root: __dirname,
});

const server = new Server(options);

server.auth(async (userId, credentials) => {
  return true;
});

const initGruops = [
  {
    id: 'A001',
    name: 'A001',
  },
];

server.channel<GroupsLoad, GroupsAll>('groups/load', {
  async access() {
    return true;
  },
  async init(ctx) {
    await ctx.sendBack({type: 'groups/all', groups: initGruops});
  },
});

server.type<GroupsAdd>('groups/add', {
  async access() {
    return true;
  },
  resend() {
    return {channel: 'groups/load'};
  },
  async process(_ctx, action, meta) {
    console.log('adding', action.group, meta);
    await initGruops.push(action.group);
  },
});

server.listen();
