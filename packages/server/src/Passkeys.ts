import {generateUuid, Passkey, User} from '@doko/common';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import {
  AuthenticationResponseJSON,
  Base64URLString,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';
import dayjs from 'dayjs';
import HttpError from './api/HttpError';
import {getTransactional, insertEntity, query} from './Connection';
import {passkeysDbConfig, usersDbConfig} from './DbTypes';

/**
 * Human-readable title for your website
 */
const rpName = 'Doko Stats';

/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
const rpID = process.env.DOKO_HOST ?? '';
if (!rpID) {
  throw new Error('DOKO_HOST environment variable is not set!');
}

/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
const proto = rpID === 'localhost' ? 'http' : `https`;
const origin = `${proto}://${rpID}`;

async function deviceExists(deviceId: string): Promise<boolean> {
  const sql = `SELECT id FROM devices WHERE id = ?`;
  const rows = await query<User>(sql, [deviceId]);
  return rows.length > 0;
}

async function getUserByName(username: string): Promise<User | null> {
  const sql = `SELECT id, username FROM users WHERE username = ?`;
  const rows = await query<User>(sql, [username]);
  return rows[0] ?? null;
}

async function getPasskey(id: string): Promise<Passkey | null> {
  const sql = `SELECT id,
                      public_key as publicKey,
                      user_id as userId,
                      web_authn_user_id as webAuthnUserID,
                      counter,
                      device_type as deviceType,
                      backed_up as backedUp,
                      transports
                 FROM passkeys 
                WHERE id = ?`;
  const rows = await query<Passkey>(sql, [id]);
  return rows[0] ?? null;
}

async function updatePasskeyCounter(id: string, count: number): Promise<void> {
  await query(`UPDATE passkeys SET counter = ? WHERE id = ?`, [count, id]);
}

const registrationCredentialOptions = new Map<string, PublicKeyCredentialCreationOptionsJSON>();
const authenticationCredentialOptions = new Map<string, PublicKeyCredentialRequestOptionsJSON>();

async function verifyDeviceUsername(deviceId: string, username: string) {
  if (!(await deviceExists(deviceId))) {
    throw new HttpError(404, 'deviceNotFound', {deviceId});
  }

  const existingUser = await getUserByName(username);
  if (existingUser) {
    throw new HttpError(409, 'usernameAlreadyExists');
  }
}

export async function registerStart(deviceId: string, username: string) {
  await verifyDeviceUsername(deviceId, username);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: username,
    attestationType: 'none',
    authenticatorSelection: {
      // Defaults
      residentKey: 'preferred',
      userVerification: 'preferred',
      // Optional
      authenticatorAttachment: 'platform',
    },
  });

  registrationCredentialOptions.set(deviceId, options);

  return options;
}

async function tryVerifyRegistration(response: RegistrationResponseJSON, challenge: Base64URLString) {
  try {
    return await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpError(400, 'verifyRegistrationResponseError', {message: e.message});
    }
    throw e;
  }
}

export async function registerVerify(deviceId: string, reqResponse: RegistrationResponseJSON): Promise<boolean> {
  const options = registrationCredentialOptions.get(deviceId);
  if (!options) {
    throw new HttpError(404, 'registrationCredentialOptionsNotFound');
  }
  await verifyDeviceUsername(deviceId, options.user.name);

  const verification = await tryVerifyRegistration(reqResponse, options.challenge);

  if (verification.verified) {
    const {registrationInfo} = verification;
    const {credential, credentialDeviceType, credentialBackedUp} = registrationInfo!;
    const userId = generateUuid();
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await getTransactional(deviceId, async (update) => {
      await insertEntity<User>(update, usersDbConfig, {
        createdOn: now,
        lastSeenOn: now,
        id: userId,
        username: options.user.name,
      });
      await insertEntity<Passkey>(update, passkeysDbConfig, {
        userId,
        backedUp: credentialBackedUp,
        counter: credential.counter,
        deviceType: credentialDeviceType,
        id: credential.id,
        publicKey: credential.publicKey,
        transports: credential.transports ?? [],
        webAuthnUserId: options.user.id,
      });
    });
  }

  return verification.verified;
}

export async function authenticateStart(deviceId: string) {
  const options = await generateAuthenticationOptions({rpID});
  authenticationCredentialOptions.set(deviceId, options);
  return options;
}

async function tryVerifyAuthentication(
  response: AuthenticationResponseJSON,
  challenge: Base64URLString,
  passkey: Passkey,
) {
  try {
    return await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: passkey.publicKey,
        counter: passkey.counter,
        transports: passkey.transports,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpError(400, 'verifyAuthenticationResponseError', {message: e.message});
    }
    throw e;
  }
}

export async function authenticateVerify(deviceId: string, authResponse: AuthenticationResponseJSON): Promise<boolean> {
  const options = authenticationCredentialOptions.get(deviceId);
  if (!options) {
    throw new HttpError(404, 'authenticationCredentialOptionsNotFound');
  }
  const passkey = await getPasskey(authResponse.id);
  if (!passkey) {
    throw new HttpError(404, 'passkeyNotFound');
  }

  const verification = await tryVerifyAuthentication(authResponse, options.challenge, passkey);

  if (verification.verified) {
    await updatePasskeyCounter(passkey.id, verification.authenticationInfo.newCounter);
  }

  return verification.verified;
}
