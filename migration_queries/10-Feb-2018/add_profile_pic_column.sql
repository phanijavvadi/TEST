ALTER TABLE cm_org_patients ADD COLUMN "profilePic" uuid;
ALTER TABLE cm_org_patients
  ADD CONSTRAINT "cm_org_patients_profilePic_fkey" FOREIGN KEY ("profilePic")
      REFERENCES cm_attachments (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE NO ACTION;

