DELIMITER $$

CREATE TRIGGER round_group_members_after_insert AFTER INSERT ON `round_group_members`
  FOR EACH ROW
    thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_round_group_members
  (revision_device_id,
   revision_on,
   revision_type,
   round_id,
   group_member_id,
   sitting_order,
   joined_after_game_number,
   left_after_game_number)
  VALUES
  (@__currentDeviceId,
   now(),
   'insert',
   NEW.round_id,
   NEW.group_member_id,
   NEW.sitting_order,
   NEW.joined_after_game_number,
   NEW.left_after_game_number);
END $$

CREATE TRIGGER round_group_members_after_update AFTER UPDATE ON `round_group_members`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_round_group_members
  (revision_device_id,
   revision_on,
   revision_type,
   round_id,
   group_member_id,
   sitting_order,
   joined_after_game_number,
   left_after_game_number)
  VALUES
  (@__currentDeviceId,
   now(),
   'update',
   NEW.round_id,
   NEW.group_member_id,
   NEW.sitting_order,
   NEW.joined_after_game_number,
   NEW.left_after_game_number);
END $$

CREATE TRIGGER round_group_members_before_delete BEFORE DELETE ON `round_group_members`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_round_group_members
  (revision_device_id,
   revision_on,
   revision_type,
   round_id,
   group_member_id,
   sitting_order,
   joined_after_game_number,
   left_after_game_number)
  VALUES
  (@__currentDeviceId,
   now(),
   'delete',
   OLD.round_id,
   OLD.group_member_id,
   OLD.sitting_order,
   OLD.joined_after_game_number,
   OLD.left_after_game_number);
END $$

DELIMITER ;

