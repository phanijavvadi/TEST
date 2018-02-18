'use strict';
import patientPrevHealthValidator from '../validators/patient.prev.health.validator';
/**
 * Module dependencies.
 */
import express from 'express';
import patientPrevHealthCtrl from '../controllers/patient.prev.health.ctrl';

const router = express.Router();
const publicRouter = express.Router();

export default function (app) {


  router.route('/:patientId')
    .get([
      patientPrevHealthCtrl.get]);

  router.route('/create')
    .post([
      patientPrevHealthValidator.createReqValidator,
      patientPrevHealthCtrl.create]);

  router.route('/add-problem')
    .post([
      patientPrevHealthValidator.addPrevHealthProblemReqValidator,
      patientPrevHealthCtrl.addProblem]);
  router.route('/remove-problem')
    .post([
      patientPrevHealthValidator.removePrevHealthProblemReqValidator,
      patientPrevHealthCtrl.removeProblem]);

  app.use('/api/org-user/private/prev-health', router);
}
