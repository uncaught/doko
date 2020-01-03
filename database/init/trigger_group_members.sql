DELIMITER $$

CREATE TRIGGER group_members_after_insert AFTER INSERT ON `group_members`
  FOR EACH ROW
    thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_group_members
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   group_id,
   name,
   is_regular)
  VALUES
  (@__currentDeviceId,
   now(),
   'insert',
   NEW.id,
   NEW.group_id,
   NEW.name,
   NEW.is_regular);
END $$

CREATE TRIGGER group_members_after_update AFTER UPDATE ON `group_members`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_group_members
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   group_id,
   name,
   is_regular)
  VALUES
  (@__currentDeviceId,
   now(),
   'update',
   NEW.id,
   NEW.group_id,
   NEW.name,
   NEW.is_regular);
END $$

CREATE TRIGGER group_members_before_delete BEFORE DELETE ON `group_members`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_group_members
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   group_id,
   name,
   is_regular)
  VALUES
  (@__currentDeviceId,
   now(),
   'delete',
   OLD.id,
   OLD.group_id,
   OLD.name,
   OLD.is_regular);
END $$

DELIMITER ;

