import {v4} from 'uuid';

export function generateUuid(): string {
  return v4().toString();
}

const regExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export function isUuid(uuid: any): uuid is string {
  return typeof uuid === 'string' && regExp.test(uuid);
}

export function generateToken(): string {
  const uuid1 = generateUuid();
  const uuid2 = generateUuid();
  return (uuid1 + uuid2).replace(/-/g, '');
}
