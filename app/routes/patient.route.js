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

export default function (app) {

  router.route('/list').get([
    patientCtrl.getOrgPatientList]);

  router.route('/:id').get([
    patientCtrl.get]);

  router.route('/import').post([
    patientValidator.importReqValidator,
    userAccessValidator.validateUserHasOrgAccess,
    orgValidator.validateOrgId,
    patientCtrl.importOrgPatient
  ]);
  router.route('/send-invitation-message').post([
    patientValidator.sendInvitationMessageValidator,
    userAccessValidator.validateUserHasOrgAccess,
    orgValidator.validateOrgId,
    patientCtrl.importOrgPatient
  ]);
  /**
  * Patient routers start
  * */
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
}
