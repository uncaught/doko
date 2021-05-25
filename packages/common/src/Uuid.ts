import {v4} from 'uuid';

export function generateUuid(): string {
  return v4().toString();
}

export const NIL = '00000000-0000-0000-0000-000000000000';

const regExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const regExpToken = /^[0-9a-f]{32}$/;

export function isUuid(uuid: any): uuid is string {
  return typeof uuid === 'string' && regExp.test(uuid);
}

export function isToken(token: any): token is string {
  return typeof token === 'string' && regExpToken.test(token);
}

export function generateToken(): string {
  return generateUuid().replace(/-/g, '');
}
