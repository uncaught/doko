import {isToken} from './Uuid';

export function generateInvitationUrl(domain: string, invitationToken: string): string {
  return `https://${domain}/invitation/${invitationToken}`;
}

export function parseInvitationUrl(url: string): string | null {
  if (url.includes('/invitation/')) {
    const token = url.split('/invitation/')[1];
    if (isToken(token)) {
      return token;
    }
  }
  return null;
}
