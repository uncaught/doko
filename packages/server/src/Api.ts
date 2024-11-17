import type {RegistrationResponseJSON} from '@simplewebauthn/types';
import Fastify from 'fastify';
import HttpError from './api/HttpError';
import {register, verify} from './Passkeys';

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
  '/passkey/register/:deviceId',
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
    return register(request.params.deviceId, request.query.username.trim().toLowerCase());
  },
);

fastify.post<{Body: RegistrationResponseJSON; Params: {deviceId: string}}>(
  '/passkey/verify/:deviceId',
  async (request, reply) => {
    reply.type('application/json').code(200);
    return verify(request.params.deviceId, request.body);
  },
);
