'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import patientCtrl from '../controllers/patient.ctrl';
import userAccessValidator from '../validators/user.access.validator';
import orgValidator from '../validators/organisation.validator';
import patientValidator from '../validators/patient.validator';

const router = express.Router();
const adminRoutes = express.Router();

export default function (app) {

  router.route('/org/list').get([
    patientCtrl.getOrgPatientList]);

  router.route('/org/:id').get([
    patientCtrl.get]);

  router.route('/org/import').post([
    patientValidator.importReqValidator,
    userAccessValidator.validateUserHasOrgAccess,
    orgValidator.validateOrgId,
    patientCtrl.importOrgPatient
  ]);
  app.use('/api/org-user/private/patient', router);
}
