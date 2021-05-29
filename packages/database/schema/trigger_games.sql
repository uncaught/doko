DELIMITER $$

CREATE TRIGGER games_after_insert AFTER INSERT ON `games`
  FOR EACH ROW
    thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_games
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   round_id,
   game_number,
   dealer_group_member_id,
   data)
  VALUES
  (@__currentDeviceId,
   now(),
   'insert',
   NEW.id,
   NEW.round_id,
   NEW.game_number,
   NEW.dealer_group_member_id,
   NEW.data);
END $$

CREATE TRIGGER games_after_update AFTER UPDATE ON `games`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_games
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   round_id,
   game_number,
   dealer_group_member_id,
   data)
  VALUES
  (@__currentDeviceId,
   now(),
   'update',
   NEW.id,
   NEW.round_id,
   NEW.game_number,
   NEW.dealer_group_member_id,
   NEW.data);
END $$

CREATE TRIGGER games_before_delete BEFORE DELETE ON `games`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_games
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   round_id,
   game_number,
   dealer_group_member_id,
   data)
  VALUES
  (@__currentDeviceId,
   now(),
   'delete',
   OLD.id,
   OLD.round_id,
   OLD.game_number,
   OLD.dealer_group_member_id,
   OLD.data);
END $$

DELIMITER ;

