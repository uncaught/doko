import {query} from '../Connection';

export async function run(update: typeof query) {
  await update(`CREATE TABLE users (
  id CHAR(36) NOT NULL,
  username VARCHAR(191) NOT NULL,
  created_on DATETIME NOT NULL,
  last_seen_on DATETIME NOT NULL,
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;`);

  await update(`CREATE TABLE passkeys (
  id VARCHAR(191) NOT NULL,
  public_key BLOB NOT NULL,
  user_id CHAR(36) NOT NULL,
  web_authn_user_id VARCHAR(191) NOT NULL,
  counter BIGINT UNSIGNED NOT NULL,
  device_type VARCHAR(32) NOT NULL,
  backed_up BOOL NOT NULL,
  transports json NOT NULL,
  created_on DATETIME NOT NULL,
  last_used_on DATETIME NOT NULL,
  INDEX IDX_USER (user_id),
  UNIQUE INDEX IDX_WEBAUTHN_USER (web_authn_user_id, user_id),
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;`);

  await update(
    `ALTER TABLE passkeys ADD CONSTRAINT FK_PASSKEY_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;`,
  );
}
