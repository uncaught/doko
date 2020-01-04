CREATE TABLE devices (
  id CHAR(36) NOT NULL,
  created_on DATETIME NOT NULL,
  created_creds JSON NOT NULL,
  last_seen_on DATETIME NOT NULL,
  last_seen_creds JSON NOT NULL,
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

CREATE TABLE `groups` (
  id CHAR(36) NOT NULL,
  name VARCHAR(191),
  settings JSON NOT NULL,
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

CREATE TABLE history_groups (
  id CHAR(36) NOT NULL,
  name VARCHAR(191),
  settings JSON NOT NULL,
  revision INT AUTO_INCREMENT NOT NULL,
  revision_device_id CHAR(36) NOT NULL,
  revision_on DATETIME NOT NULL,
  revision_type ENUM('insert', 'update', 'delete'),
  PRIMARY KEY(revision)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

CREATE TABLE group_members (
  id CHAR(36) NOT NULL,
  group_id CHAR(36) NOT NULL,
  name VARCHAR(191),
  is_regular TINYINT(1),
  INDEX IDX_GROUP_MEMBERS_GROUP (group_id),
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
ALTER TABLE group_members ADD CONSTRAINT FK_GROUP_MEMBERS_GROUP FOREIGN KEY (group_id) REFERENCES `groups` (id) ON DELETE CASCADE;

CREATE TABLE history_group_members (
  id CHAR(36) NOT NULL,
  group_id CHAR(36) NOT NULL,
  name VARCHAR(191),
  is_regular TINYINT(1),
  revision INT AUTO_INCREMENT NOT NULL,
  revision_device_id CHAR(36) NOT NULL,
  revision_on DATETIME NOT NULL,
  revision_type ENUM('insert', 'update', 'delete'),
  PRIMARY KEY(revision)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

CREATE TABLE group_member_devices (
  group_member_id CHAR(36) NOT NULL,
  device_id CHAR(36) NOT NULL,
  inviter_device_id CHAR(36) NOT NULL,
  invited_on DATETIME NOT NULL,
  INDEX IDX_GROUP_MEMBER_DEVICES_DEVICE (device_id),
  INDEX IDX_GROUP_MEMBER_DEVICES_INVITER_DEVICE (inviter_device_id),
  PRIMARY KEY(group_member_id, device_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

ALTER TABLE group_member_devices ADD CONSTRAINT FK_GROUP_MEMBER_DEVICE_GROUP_MEMBER FOREIGN KEY (group_member_id) REFERENCES group_members (id) ON DELETE CASCADE;
ALTER TABLE group_member_devices ADD CONSTRAINT FK_GROUP_MEMBER_DEVICE_DEVICE FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE CASCADE;
ALTER TABLE group_member_devices ADD CONSTRAINT FK_GROUP_MEMBER_DEVICE_INVITER_DEVICE FOREIGN KEY (inviter_device_id) REFERENCES devices (id) ON DELETE CASCADE;

CREATE TABLE rounds (
  id CHAR(36) NOT NULL,
  group_id CHAR(36) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME DEFAULT NULL,
  INDEX IDX_ROUNDS_GROUP (group_id),
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

ALTER TABLE rounds ADD CONSTRAINT FK_ROUNDS_GROUP FOREIGN KEY (group_id) REFERENCES `groups` (id) ON DELETE CASCADE;

CREATE TABLE history_rounds (
  id CHAR(36) NOT NULL,
  group_id CHAR(36) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME DEFAULT NULL,
  revision INT AUTO_INCREMENT NOT NULL,
  revision_device_id CHAR(36) NOT NULL,
  revision_on DATETIME NOT NULL,
  revision_type ENUM('insert', 'update', 'delete'),
  PRIMARY KEY(revision)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

CREATE TABLE round_group_members (
  round_id CHAR(36) NOT NULL,
  group_member_id CHAR(36) NOT NULL,
  sitting_order TINYINT(1) UNSIGNED,
  joined_after_game_number TINYINT(2) UNSIGNED DEFAULT 0,
  left_after_game_number TINYINT(2) UNSIGNED DEFAULT NULL,
  INDEX IDX_ROUND_GROUP_MEMBERS_GROUP_MEMBER (group_member_id),
  PRIMARY KEY(round_id, group_member_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

ALTER TABLE round_group_members ADD CONSTRAINT FK_ROUND_GROUP_MEMBERS_ROUND FOREIGN KEY (round_id) REFERENCES rounds (id) ON DELETE RESTRICT;
ALTER TABLE round_group_members ADD CONSTRAINT FK_ROUND_GROUP_MEMBERS_GROUP_MEMBER FOREIGN KEY (group_member_id) REFERENCES group_members (id) ON DELETE RESTRICT;

CREATE TABLE history_round_group_members (
  round_id CHAR(36) NOT NULL,
  group_member_id CHAR(36) NOT NULL,
  sitting_order TINYINT(1) UNSIGNED,
  joined_after_game_number TINYINT(2) UNSIGNED DEFAULT 0,
  left_after_game_number TINYINT(2) UNSIGNED DEFAULT NULL,
  revision INT AUTO_INCREMENT NOT NULL,
  revision_device_id CHAR(36) NOT NULL,
  revision_on DATETIME NOT NULL,
  revision_type ENUM('insert', 'update', 'delete'),
  PRIMARY KEY(revision)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

CREATE TABLE games (
  id CHAR(36) NOT NULL,
  round_id CHAR(36) NOT NULL,
  game_number TINYINT(2) UNSIGNED,
  dealer_group_member_id CHAR(36) NOT NULL,
  data JSON NOT NULL,
  INDEX IDX_GAMES_ROUND (round_id),
  INDEX IDX_GAMES_DEALER (dealer_group_member_id),
  PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
CREATE UNIQUE INDEX UNIQ_GAME_NUMBER ON games(round_id, game_number);

ALTER TABLE games ADD CONSTRAINT FK_GAMES_ROUND FOREIGN KEY (round_id) REFERENCES rounds (id) ON DELETE CASCADE;
ALTER TABLE games ADD CONSTRAINT FK_GAMES_DEALER FOREIGN KEY (dealer_group_member_id) REFERENCES group_members (id) ON DELETE CASCADE;

CREATE TABLE history_games (
  id CHAR(36) NOT NULL,
  round_id CHAR(36) NOT NULL,
  game_number TINYINT(2) UNSIGNED,
  dealer_group_member_id CHAR(36) NOT NULL,
  data JSON NOT NULL,
  revision INT AUTO_INCREMENT NOT NULL,
  revision_device_id CHAR(36) NOT NULL,
  revision_on DATETIME NOT NULL,
  revision_type ENUM('insert', 'update', 'delete'),
  PRIMARY KEY(revision)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
