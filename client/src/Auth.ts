import {generateUuid, isUuid} from '@doko/common/Uuid';
import {Credentials} from '@doko/common/Auth';

export function getAuth(): { userId: string; credentials: Credentials } {
  let userId = localStorage.getItem('userId');
  if (!isUuid(userId)) {
    userId = generateUuid();
    localStorage.setItem('userId', userId);
  }
  const {navigator, screen} = window;
  return {
    userId,
    credentials: {
      navigator: {
        languages: navigator.languages,
        userAgent: navigator.userAgent,
      },
      screen: {
        availHeight: screen.availHeight,
        availWidth: screen.availWidth,
        height: screen.height,
        width: screen.width,
      },
    },
  };
}
