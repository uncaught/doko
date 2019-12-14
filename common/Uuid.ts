import {v4} from 'uuid';

export function generateUuid(): string {
  return v4().toString();
}
