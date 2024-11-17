import {generateUuid, Passkey, User} from '@doko/common';
import {generateRegistrationOptions, verifyRegistrationResponse} from '@simplewebauthn/server';
import {Base64URLString, PublicKeyCredentialCreationOptionsJSON, RegistrationResponseJSON} from '@simplewebauthn/types';
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

async function getUserPasskeys(userId: string): Promise<Passkey[]> {
  const sql = `SELECT id,
                      public_key as publicKey,
                      user_id as userId,
                      web_authn_user_id as webAuthnUserID,
                      counter,
                      device_type as deviceType,
                      backed_up as backedUp,
                      transports
                 FROM passkeys 
                WHERE user_id = ?`;
  const rows = await query<Passkey>(sql, [userId]);
  //TODO: Potentially json parse the transports and make publicKey a Uint8Array
  return rows;
}

const credOptions = new Map<string, PublicKeyCredentialCreationOptionsJSON>();

async function verifyDeviceUsername(deviceId: string, username: string) {
  if (!(await deviceExists(deviceId))) {
    throw new HttpError(404, 'deviceNotFound', {deviceId});
  }

  const existingUser = await getUserByName(username);
  if (existingUser) {
    throw new HttpError(409, 'usernameAlreadyExists');
  }
}

export async function register(deviceId: string, username: string) {
  await verifyDeviceUsername(deviceId, username);

  // const userPasskeys = await getUserPasskeys(user.id); //doesn't make sense here, it's a new user
  const userPasskeys: Passkey[] = [];

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userPasskeys.map((passkey) => ({
      id: passkey.id,
      // Optional
      transports: passkey.transports,
    })),
    // See "Guiding use of authenticators via authenticatorSelection" below
    authenticatorSelection: {
      // Defaults
      residentKey: 'preferred',
      userVerification: 'preferred',
      // Optional
      authenticatorAttachment: 'platform',
    },
  });

  credOptions.set(deviceId, options);

  return options;
}

async function tryVerify(response: RegistrationResponseJSON, challenge: Base64URLString) {
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

export async function verify(deviceId: string, response: RegistrationResponseJSON): Promise<boolean> {
  const options = credOptions.get(deviceId);
  if (!options) {
    throw new HttpError(404, 'credentialOptionsNotFound');
  }
  await verifyDeviceUsername(deviceId, options.user.name);

  const verification = await tryVerify(response, options.challenge);

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
