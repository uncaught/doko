import {urlDecode64, urlEncode64} from './UrlEncode64';
import {isPlainObject} from 'lodash';
import {isToken, isUuid} from './Uuid';

interface Invitation {
  groupId: string;
  groupMemberId: string;
  invitationToken: string;
}

export function generateInvitationUrl(domain: string, {groupId, groupMemberId, invitationToken}: Invitation): string {
  const json = JSON.stringify({groupId, groupMemberId, invitationToken});
  const encoded = urlEncode64(json);
  return `https://${domain}/acceptInvitation/${encoded}`;
}

export function parseInvitationUrl(url: string): Invitation | null {
  try {
    if (url.includes('/acceptInvitation/')) {
      const split = url.split('/acceptInvitation/')[1];
      if (split && /^[a-zA-Z0-9_\-]+$/.test(split)) {
        const decoded = urlDecode64(split);
        const parsed = JSON.parse(decoded) as Invitation;
        if (isPlainObject(parsed)
          && isUuid(parsed.groupId)
          && isUuid(parsed.groupMemberId)
          && isToken(parsed.invitationToken)
        ) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}
