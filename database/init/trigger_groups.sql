DELIMITER $$

CREATE TRIGGER groups_after_insert AFTER INSERT ON `groups`
  FOR EACH ROW
    thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_groups
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   name)
  VALUES
  (@__currentDeviceId,
   now(),
   'insert',
   NEW.id,
   NEW.name);
END $$

CREATE TRIGGER groups_after_update AFTER UPDATE ON `groups`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_groups
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   name)
  VALUES
  (@__currentDeviceId,
   now(),
   'update',
   NEW.id,
   NEW.name);
END $$

CREATE TRIGGER groups_before_delete BEFORE DELETE ON `groups`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_groups
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   name)
  VALUES
  (@__currentDeviceId,
   now(),
   'delete',
   OLD.id,
   OLD.name);
END $$

DELIMITER ;

