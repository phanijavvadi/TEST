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
const publicRouter = express.Router();
const adminRoutes = express.Router();
const patientRouter = express.Router();
const patientPublicRouter = express.Router();
const patientImportRouter = express.Router();

export default function (app) {

  router.route('/list').get([
    patientCtrl.getOrgPatientList]);

  router.route('/:id').get([
    patientCtrl.get]);

  router.route('/:id/medical-history').get([
    patientCtrl.getMedicalHistory]);

  router.route('/:id/family-history').get([
    patientCtrl.getFamilyHistoryList]);

  router.route('/:id/medications').get([
    patientCtrl.getMedicationList]);

  router.route('/send-invitation-message').post([
    patientValidator.sendInvitationMessageValidator,
    userAccessValidator.validateUserHasOrgAccess,
    orgValidator.validateOrgId,
    patientCtrl.sendInvitationMessage
  ]);


  /**
   * Import patient details
   */
  patientImportRouter.route('/patients').post([
    patientValidator.importPatientsReqValidator,
    patientCtrl.importOrgPatient
  ]);
  patientImportRouter.route('/patient/medical-history').post([
    patientValidator.importPatientMedicalHistoryReqValidator,
    patientCtrl.importOrgPatientMedicalHistory
  ]);
  patientImportRouter.route('/patient/family-history').post([
    patientValidator.importPatientFamilyHistoryReqValidator,
    patientCtrl.importOrgPatientFamilyHistory
  ]);
  patientImportRouter.route('/patient/medications').post([
    patientValidator.importPatientMedicationReqValidator,
    patientCtrl.importOrgPatientMedications
  ]);

  /**
   * Patient routers start
   */
  patientRouter.route('/profile/:id').get([
    patientCtrl.get]);
  patientPublicRouter.route('/sign-up').post([
    patientValidator.signUpValidator,
    patientValidator.patientEmailUniqueValidation,
    patientValidator.validatePatientNumberIsRegistered,
    patientCtrl.signUp
  ]);
  patientPublicRouter.route('/sign-in').post([
    patientValidator.signInValidator,
    patientCtrl.signIn
  ]);


  app.use('/api/patient/private', patientRouter);
  app.use('/api/patient/public', patientPublicRouter);

  app.use('/api/org-user/patient', publicRouter);
  app.use('/api/org-user/private/patient', router);
  app.use('/api/import-data/private', patientImportRouter);
}
