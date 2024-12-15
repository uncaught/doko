import {AuthenticationResponseJSON, RegistrationResponseJSON} from '@simplewebauthn/types';
import Fastify from 'fastify';
import HttpError from './api/HttpError';
import {authenticateStart, authenticateVerify, registerStart, registerVerify} from './Passkeys';

const port = 4000;

const fastify = Fastify({
  logger: true,
});

export async function initApi() {
  return new Promise<void>((resolve, reject) => {
    fastify.listen({host: '0.0.0.0', port: port}, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`api listening on port ${port}`);
        resolve();
      }
    });
  });
}

fastify.setErrorHandler(function (error, request, reply) {
  this.log.error(error);
  if (error instanceof HttpError) {
    const {status, code, context} = error;
    reply.type('application/json').status(status).send({code, context});
  } else {
    reply.status(500).send('Internal server error');
  }
});

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  return {hello: 'world'};
});

fastify.get<{Querystring: {username: string}; Params: {deviceId: string}}>(
  '/passkey/register/:deviceId/start',
  {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          username: {type: 'string'},
        },
        required: ['username'],
      },
    },
  },
  async (request, reply) => {
    reply.type('application/json').code(200);
    return registerStart(request.params.deviceId, request.query.username.trim().toLowerCase());
  },
);

fastify.post<{Body: RegistrationResponseJSON; Params: {deviceId: string}}>(
  '/passkey/register/:deviceId/verify',
  async (request, reply) => {
    reply.type('application/json').code(200);
    return registerVerify(request.params.deviceId, request.body);
  },
);

fastify.get<{Params: {deviceId: string}}>('/passkey/authenticate/:deviceId/start', async (request, reply) => {
  reply.type('application/json').code(200);
  return authenticateStart(request.params.deviceId);
});

fastify.post<{Body: AuthenticationResponseJSON; Params: {deviceId: string}}>(
  '/passkey/authenticate/:deviceId/verify',
  async (request, reply) => {
    reply.type('application/json').code(200);
    return authenticateVerify(request.params.deviceId, request.body);
  },
);
