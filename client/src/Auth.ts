import {Credentials, generateUuid, isUuid} from '@doko/common';

export function getAuth(): { userId: string; credentials: Credentials } {
  let deviceId = localStorage.getItem('deviceId');
  if (!isUuid(deviceId)) {
    deviceId = generateUuid();
    localStorage.setItem('deviceId', deviceId);
  }
  const {navigator, screen} = window;
  return {
    userId: deviceId,
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
