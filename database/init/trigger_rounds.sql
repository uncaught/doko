DELIMITER $$

CREATE TRIGGER rounds_after_insert AFTER INSERT ON `rounds`
  FOR EACH ROW
    thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_rounds
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   group_id,
   start_date,
   end_date)
  VALUES
  (@__currentDeviceId,
   now(),
   'insert',
   NEW.id,
   NEW.group_id,
   NEW.start_date,
   NEW.end_date);
END $$

CREATE TRIGGER rounds_after_update AFTER UPDATE ON `rounds`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_rounds
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   group_id,
   start_date,
   end_date)
  VALUES
  (@__currentDeviceId,
   now(),
   'update',
   NEW.id,
   NEW.group_id,
   NEW.start_date,
   NEW.end_date);
END $$

CREATE TRIGGER rounds_before_delete BEFORE DELETE ON `rounds`
  FOR EACH ROW
thisTrigger: BEGIN
  IF (@TRIGGER_CHECKS = FALSE)
  THEN
    LEAVE thisTrigger;
  END IF;

  INSERT INTO history_rounds
  (revision_device_id,
   revision_on,
   revision_type,
   id,
   group_id,
   start_date,
   end_date)
  VALUES
  (@__currentDeviceId,
   now(),
   'delete',
   OLD.id,
   OLD.group_id,
   OLD.start_date,
   OLD.end_date);
END $$

DELIMITER ;

