'use strict';
import patientCarePlanValidator from '../validators/patient.care.plan.validator';
/**
 * Module dependencies.
 */
import express from 'express';
import patientCarePlanCtrl from '../controllers/patient.care.plan.ctrl';

const router = express.Router();
const publicRouter = express.Router();

export default function (app) {


  router.route('/:patientId')
    .get([
      patientCarePlanCtrl.get]);

  router.route('/create')
    .post([
      patientCarePlanValidator.createReqValidator,
      patientCarePlanCtrl.create]);

  router.route('/add-problem')
    .post([
      patientCarePlanValidator.addCarePlanProblemReqValidator,
      patientCarePlanCtrl.addProblem]);
  router.route('/remove-problem')
    .post([
      patientCarePlanValidator.removeCarePlanProblemReqValidator,
      patientCarePlanCtrl.removeProblem]);

  app.use('/api/org-user/private/care-plan', router);
}
